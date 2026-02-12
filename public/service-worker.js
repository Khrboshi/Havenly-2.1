/* public/service-worker.js */
/* Havenly PWA Service Worker — cache-first for static, network-first for pages */

const CACHE_NAME = "havenly-pwa-v7";

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/service-worker.js",

  // Favicons / UI icons (fix offline logo issues)
  "/favicon.ico",
  "/icon.svg",
  "/apple-touch-icon.png",

  // PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // PWA screenshots
  "/pwa/screenshot-1.png",
  "/pwa/screenshot-2.png",
];

// Install: precache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only same-origin
  if (url.origin !== self.location.origin) return;

  const pathname = url.pathname;

  // ✅ 1) Next.js build assets must be cache-first (fixes hashed chunk offline errors)
  const isNextStatic =
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image");

  if (isNextStatic) {
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

  // ✅ 2) App assets (icons/images/css/js/json) cache-first
  const isAsset =
    pathname.startsWith("/pwa/") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".json");

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

  // ✅ 3) Navigations/pages: network-first, fallback to cache, then "/"
  const isNavigation = req.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Default: cache-first fallback
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});
