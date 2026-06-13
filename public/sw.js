const CACHE_NAME = 'kitchen-rescue-v1';
const STORAGE_KEY = 'kitchen-rescue-storage';
const NOTIFIED_KEY = 'kitchen-rescue-notified-ingredients';

const DAY_MS = 24 * 60 * 60 * 1000;

const getExpiryStatus = (remainingDays) => {
  if (remainingDays < 0) return 'expired';
  if (remainingDays <= 3) return 'urgent';
  if (remainingDays <= 7) return 'warning';
  return 'fresh';
};

const todayStr = () => new Date().toISOString().split('T')[0];

const daysBetween = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.floor((d2.getTime() - d1.getTime()) / DAY_MS);
};

const readNotifiedIds = async () => {
  try {
    const result = await clients.matchAll({ includeUncontrolled: true });
    for (const client of result) {
      client.postMessage({ type: 'GET_NOTIFIED_IDS' });
    }
  } catch (e) {
    /* ignore */
  }
  try {
    const raw = new URLSearchParams(location.search).get('notified') || '';
    return new Set(raw ? raw.split(',') : []);
  } catch {
    return new Set();
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html', '/favicon.svg']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();

  try {
    if ('periodicSync' in self.registration) {
      self.registration.periodicSync
        .register('check-expiry', {
          minInterval: 30 * 60 * 1000,
        })
        .catch(() => {});
    }
  } catch {
    /* ignore */
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-expiry') {
    event.waitUntil(checkAndNotifyFromSW());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'check-expiry') {
    event.waitUntil(checkAndNotifyFromSW());
  }
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(showSWNotification(data.payload));
  } else if (data.type === 'CHECK_EXPIRY') {
    event.waitUntil(checkAndNotifyFromSW());
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ includeUncontrolled: true, type: 'window' })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            const url = new URL(client.url);
            url.pathname = '/expiring';
            return client.navigate(url.toString()).then((c) => c?.focus());
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/expiring');
        }
      })
  );
});

async function showSWNotification(payload) {
  try {
    await self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: payload.tag,
      requireInteraction: false,
      silent: false,
      data: { url: '/expiring' },
    });
  } catch (e) {
    /* ignore */
  }
}

async function checkAndNotifyFromSW() {
  try {
    const clientsList = await clients.matchAll({
      includeUncontrolled: true,
      type: 'window',
    });

    if (clientsList.length > 0) {
      for (const client of clientsList) {
        client.postMessage({ type: 'TRIGGER_CHECK' });
      }
      return;
    }
  } catch {
    /* ignore */
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/sw-state');
    if (!cachedResponse) return;

    const state = await cachedResponse.json();
    const stock = state.stockIngredients || [];
    const now = todayStr();

    const urgentItems = stock
      .map((s) => {
        const expiryDate = new Date(s.purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + s.shelfLifeDays);
        const expiryStr = expiryDate.toISOString().split('T')[0];
        const remainingDays = daysBetween(now, expiryStr);
        return {
          ...s,
          remainingDays,
          status: getExpiryStatus(remainingDays),
        };
      })
      .filter((s) => s.status === 'urgent');

    const notifiedStr = (await cache.match('/sw-notified'))
      ? (await (await cache.match('/sw-notified')).text())
      : '';
    const notified = new Set(notifiedStr ? notifiedStr.split(',') : []);
    const newNotified = new Set(notified);

    for (const item of urgentItems) {
      if (!notified.has(item.id)) {
        const title =
          item.remainingDays === 0
            ? `🍳 ${item.name} 今天就到期了！`
            : `⏰ ${item.name} 还剩 ${item.remainingDays} 天`;
        const body =
          item.remainingDays === 0
            ? '赶紧吃掉或处理掉，别浪费哦～'
            : item.remainingDays === 1
            ? '明天就要过期啦，安排一下！'
            : '食材进入紧急状态，尽快安排食用';

        await showSWNotification({
          title,
          body,
          tag: `kitchen-expiry-${item.id}`,
        });
        newNotified.add(item.id);
      }
    }

    const stockIds = new Set(stock.map((s) => s.id));
    for (const id of newNotified) {
      if (!stockIds.has(id)) newNotified.delete(id);
    }

    await cache.put(
      '/sw-notified',
      new Response([...newNotified].join(','), {
        headers: { 'Content-Type': 'text/plain' },
      })
    );
  } catch (e) {
    /* ignore */
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.pathname === '/sw-state-sync' && req.method === 'POST') {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
