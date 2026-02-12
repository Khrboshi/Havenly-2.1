/* public/service-worker.js */
/* Havenly PWA Service Worker (cache-first static, network-first pages) */

const CACHE_NAME = "havenly-pwa-v6"; // ⬅️ bump to force update

const PRECACHE_URLS = [
  // Core
  "/",
  "/manifest.json",
  "/service-worker.js",

  // Favicons / app icons
  "/favicon.ico",
  "/favicon-16.png",
  "/favicon-32.png",
  "/apple-touch-icon.png",
  "/icon.svg", // ✅ IMPORTANT: fixes offline Navbar/logo if it uses /icon.svg

  // PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // PWA screenshots (for install UI)
  "/pwa/screenshot-1.png",
  "/pwa/screenshot-2.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Ignore non-GET
  if (req.method !== "GET") return;

  const isNextStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/_next/image");

  const isAsset =
    isNextStatic ||
    url.pathname.startsWith("/pwa/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".json");

  // ✅ Cache-first for assets (icons, images, next static, etc.)
  if (isAsset) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // ✅ Network-first for navigation/pages (keeps auth + fresh pages)
  const isNavigation = req.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Default: try cache then network
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
