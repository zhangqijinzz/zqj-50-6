import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.info('[SW] Registered:', registration.scope);
        setInterval(() => {
          if (registration.active) {
            const state = localStorage.getItem('kitchen-rescue-storage');
            if (state) {
              caches.open('kitchen-rescue-v1').then((cache) => {
                cache.put('/sw-state', new Response(state, {
                  headers: { 'Content-Type': 'application/json' },
                }));
              });
            }
          }
        }, 30000);
      })
      .catch((error) => {
        console.warn('[SW] Registration failed:', error);
      });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'TRIGGER_CHECK') {
        const ev = new CustomEvent('sw-check-expiry');
        window.dispatchEvent(ev);
      }
    });
  });
}
