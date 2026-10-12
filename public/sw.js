// Collabix PWA Service Worker
const CACHE_NAME = 'collabix-pwa-v5';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/screenshots/screenshot-mobile.png',
  '/screenshots/screenshot-desktop.png',
];

// Install: Pre-cache offline page and core brand assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' })).catch(() => {});
      await Promise.allSettled(
        PRECACHE_ASSETS.map((asset) => cache.add(new Request(asset, { cache: 'reload' })))
      );
    })
  );
  self.skipWaiting();
});

// Activate: Delete all previous caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== 'GET') {
    return;
  }

  // Bypass non-HTTP(S) schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Bypass external APIs and third-party services (Firebase, Auth, Google APIs)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('identitytoolkit') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('googleapis.com') ||
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  // CRITICAL: Bypass dev server modules, Vite HMR, Vite deps and hot-reloaded source code.
  // Caching these breaks React's singleton dispatcher and causes "Invalid hook call".
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.jsx') ||
    url.searchParams.has('v') ||
    url.searchParams.has('t')
  ) {
    return;
  }

  // 1. Navigation requests (HTML document loads) -> Network-First with Offline Fallback
  if (
    req.mode === 'navigate' ||
    (req.headers.get('accept') && req.headers.get('accept').includes('text/html'))
  ) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          // If network is offline, return cached page or offline.html fallback
          const cachedResponse = await caches.match(req);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlineFallback = await caches.match(OFFLINE_URL);
          if (offlineFallback) {
            return offlineFallback;
          }
          const rootFallback = await caches.match('/');
          if (rootFallback) {
            return rootFallback;
          }
          return new Response(
            '<!DOCTYPE html><html lang="uz"><head><meta charset="utf-8"><title>Internet aloqasi yo‘q — Collabix</title><style>body{font-family:sans-serif;background:#14121F;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}</style></head><body><div><h1>Internet aloqasi yo‘q</h1><p>Iltimos, internetingizni tekshirib qayta urinib ko‘ring.</p></div></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. Production static assets (manifest, images, icons, fonts, compiled dist assets)
  if (url.origin === self.location.origin) {
    // Only cache static files like images, icons, manifest, or hashed assets in /assets/
    const isStaticAsset =
      url.pathname.startsWith('/icons/') ||
      url.pathname.startsWith('/screenshots/') ||
      url.pathname.startsWith('/assets/') ||
      url.pathname === '/manifest.json' ||
      url.pathname === '/offline.html' ||
      url.pathname === '/favicon.png' ||
      url.pathname === '/icon.svg' ||
      url.pathname === '/apple-touch-icon.png';

    if (isStaticAsset) {
      event.respondWith(
        caches.match(req).then((cachedResponse) => {
          const fetchPromise = fetch(req)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(req, clone);
                });
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        })
      );
      return;
    }
  }
});

// Allow immediate activation message from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
