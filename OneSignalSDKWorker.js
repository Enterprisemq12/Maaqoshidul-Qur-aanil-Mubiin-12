/**
 * Service Worker MAQOOSHIDUL QUR-AAN 12 (PWA)
 * Mendukung instalasi native web app (Standalone) & caching offline
 */

// Import OneSignal jika tersedia di hosting
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch(e) {}

const CACHE_NAME = 'mq12-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo-mq12.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Hanya intercept request GET
  if (event.request.method !== 'GET') return;
  
  // Lewatkan panggilan API ke Google Apps Script secara live (tanpa cache)
  const url = event.request.url || '';
  if (url.includes('script.google.com') || url.includes('onesignal.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
