/* public/service-worker.js */

const CACHE_NAME = "havenly-cache-v2";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icon.svg",

  // PWA icons + screenshots
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",
  "/pwa/screenshots/screenshot-wide.png",
  "/pwa/screenshots/screenshot-narrow.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Network-first for navigation (keeps app fresh)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/"))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
