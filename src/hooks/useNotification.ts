import { useEffect, useCallback, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import type { StockIngredientWithStatus } from '@/types';

const NOTIFICATION_PERMISSION_KEY = 'kitchen-rescue-notification-permission';
const NOTIFIED_INGREDIENTS_KEY = 'kitchen-rescue-notified-ingredients';
const NOTIFICATION_PROMPTED_KEY = 'kitchen-rescue-notification-prompted';
const CACHE_NAME = 'kitchen-rescue-v1';

export type PermissionPromptState = 'idle' | 'prompted' | 'granted' | 'denied' | 'dismissed';

function readNotifiedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_INGREDIENTS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function writeNotifiedIds(ids: Set<string>) {
  try {
    localStorage.setItem(NOTIFIED_INGREDIENTS_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

function hasPromptedBefore(): boolean {
  return localStorage.getItem(NOTIFICATION_PROMPTED_KEY) === 'true';
}

function markPrompted() {
  localStorage.setItem(NOTIFICATION_PROMPTED_KEY, 'true');
}

export function getPermissionState(): PermissionPromptState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  const permission = Notification.permission;
  if (permission === 'granted') return 'granted';
  if (permission === 'denied') return 'denied';

  const saved = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
  if (saved === 'dismissed') return 'dismissed';
  if (saved === 'prompted') return 'prompted';
  return 'idle';
}

export function savePermissionState(state: PermissionPromptState) {
  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, state);
}

async function sendViaServiceWorker(title: string, body: string, tag: string) {
  if (!('serviceWorker' in navigator)) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration && registration.active) {
      registration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: { title, body, tag },
      });
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

async function syncStateToServiceWorker() {
  if (!('caches' in window)) return;
  try {
    const state = localStorage.getItem('kitchen-rescue-storage');
    if (state) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(
        '/sw-state',
        new Response(state, {
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
  } catch {
    /* ignore */
  }
}

async function sendNotification(item: StockIngredientWithStatus) {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;

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

  const tag = `kitchen-expiry-${item.id}`;

  const sent = await sendViaServiceWorker(title, body, tag);
  if (sent) return;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      window.location.hash = '';
      window.location.href = '/expiring';
      notification.close();
    };

    setTimeout(() => {
      notification.close();
    }, 10000);
  } catch {
    /* ignore */
  }
}

export async function sendTestNotification(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  const title = '🔔 测试通知：临期提醒正常工作';
  const body = '示例食材「胡萝卜」还剩 2 天，快安排吃掉它吧～';
  const tag = 'kitchen-expiry-test';

  const sent = await sendViaServiceWorker(title, body, tag);
  if (sent) return true;

  try {
    const n = new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag,
    });
    n.onclick = () => {
      window.focus();
      window.location.href = '/expiring';
      n.close();
    };
    setTimeout(() => n.close(), 8000);
    return true;
  } catch {
    return false;
  }
}

export function useNotification() {
  const { getStockByStatus, getStockWithStatus, stockIngredients } = useStore();
  const [permissionState, setPermissionState] = useState<PermissionPromptState>(() =>
    getPermissionState()
  );
  const checkedRef = useRef(false);

  const checkAndNotify = useCallback(() => {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;

    const { urgent } = getStockByStatus();
    const notified = readNotifiedIds();
    const newNotified = new Set(notified);

    for (const item of urgent) {
      if (!notified.has(item.id)) {
        sendNotification(item);
        newNotified.add(item.id);
      }
    }

    const allStock = getStockWithStatus();
    const allIds = new Set(allStock.map((s) => s.id));
    for (const id of newNotified) {
      if (!allIds.has(id)) {
        newNotified.delete(id);
      }
    }

    writeNotifiedIds(newNotified);
    syncStateToServiceWorker();
  }, [getStockByStatus, getStockWithStatus]);

  const requestPermission = useCallback(async (): Promise<PermissionPromptState> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      savePermissionState('denied');
      setPermissionState('denied');
      return 'denied';
    }

    markPrompted();
    savePermissionState('prompted');
    setPermissionState('prompted');

    if (Notification.permission === 'granted') {
      savePermissionState('granted');
      setPermissionState('granted');
      checkAndNotify();
      syncStateToServiceWorker();
      return 'granted';
    }
    if (Notification.permission === 'denied') {
      savePermissionState('denied');
      setPermissionState('denied');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        savePermissionState('granted');
        setPermissionState('granted');
        checkAndNotify();
        syncStateToServiceWorker();
        return 'granted';
      } else {
        savePermissionState('denied');
        setPermissionState('denied');
        return 'denied';
      }
    } catch {
      savePermissionState('denied');
      setPermissionState('denied');
      return 'denied';
    }
  }, [checkAndNotify]);

  const dismissPrompt = useCallback(() => {
    savePermissionState('dismissed');
    setPermissionState('dismissed');
  }, []);

  useEffect(() => {
    if (permissionState !== 'granted') return;

    if (!checkedRef.current) {
      checkedRef.current = true;
      checkAndNotify();
    }

    const interval = setInterval(checkAndNotify, 60 * 1000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAndNotify();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onSWTrigger = () => {
      checkAndNotify();
    };
    window.addEventListener('sw-check-expiry', onSWTrigger);

    const stateInterval = setInterval(syncStateToServiceWorker, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(stateInterval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('sw-check-expiry', onSWTrigger);
    };
  }, [permissionState, checkAndNotify]);

  useEffect(() => {
    if (permissionState === 'granted') {
      syncStateToServiceWorker();
    }
  }, [stockIngredients, permissionState]);

  return {
    permissionState,
    requestPermission,
    dismissPrompt,
    checkAndNotify,
    shouldShowPrompt: permissionState === 'idle' && !hasPromptedBefore(),
    shouldShowGuideBar: permissionState === 'denied' || permissionState === 'dismissed',
    refreshPermissionState: () => setPermissionState(getPermissionState()),
    sendTestNotification,
    syncStateToServiceWorker,
  };
}

export { sendNotification };
