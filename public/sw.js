/* Version and precache list are injected by the production build. */
const CACHE = '__DEENFLOW_CACHE__';
const PRECACHE = __DEENFLOW_PRECACHE__;
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE))); });
self.addEventListener('activate', event => { event.waitUntil((async () => { for (const key of await caches.keys()) if (key.startsWith('deenflow-') && key !== CACHE) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener('message', event => { if (event.data === 'ACTIVATE_UPDATE') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/')) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => { const cache = await caches.open(CACHE); try { const response = await fetch(request); if (response.ok) await cache.put(request, response.clone()); return response; } catch { return await cache.match(request) || await cache.match('/') || new Response('DeenFlow is offline. Reconnect once to download the app.', { status: 503 }); } })()); return;
  }
  if (url.pathname.startsWith('/assets/') || /\.(png|json)$/.test(url.pathname)) event.respondWith((async () => { const cache = await caches.open(CACHE); const stored = await cache.match(request); if (stored) return stored; const response = await fetch(request); if (response.ok) await cache.put(request, response.clone()); return response; })());
});
self.addEventListener('push', event => { event.waitUntil((async () => { let data; try { data = event.data.json(); } catch { return; } if (!data || typeof data.title !== 'string') return; await self.registration.showNotification(data.title, { body: String(data.body || ''), icon: '/icon-192.png', badge: '/icon-192.png', tag: String(data.tag || 'deenflow'), silent: Boolean(data.silent), data: { url: String(data.tag || '').includes('adhkar') ? '/tools/adhkar' : '/' } }); })()); });
self.addEventListener('notificationclick', event => { event.notification.close(); event.waitUntil((async () => { const url = new URL(event.notification.data?.url || '/', self.location.origin); if (url.origin !== self.location.origin) return; const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); if (clients.length) { await clients[0].navigate(url.href); await clients[0].focus(); } else await self.clients.openWindow(url.href); })()); });
