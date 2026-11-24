/**
 * Service Worker MAQOOSHIDUL QUR-AAN 12 (PWA)
 * Mendukung instalasi native web app (Standalone) & caching offline (Network-First)
 */

// Import OneSignal jika tersedia di hosting
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch(e) {}

const CACHE_NAME = 'mq12-v2026-11-24';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './api.js',
  './manifest.json',
  './logo-mq12.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW Install Cache Warning]:', err);
      });
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
  
  // Lewatkan panggilan API ke Google Apps Script dan OneSignal secara live (tanpa cache)
  const url = event.request.url || '';
  if (url.includes('script.google.com') || url.includes('onesignal.com')) {
    return;
  }

  // Network-First untuk berkas aplikasi (index.html, api.js, root)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Jika response valid, update cache di background
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Jika offline atau jaringan gagal, fallback ke cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
