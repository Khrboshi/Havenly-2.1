/* public/service-worker.js */
const CACHE_NAME = "hvn-static-v4";

/**
 * Precache essentials:
 * - PWA icons + screenshots
 * - offline fallback page
 * - site icon / favicon assets (critical for the "logo broken offline" symptom)
 */
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",

  // ✅ Site icon(s)
  "/icon.svg",
  "/favicon.ico",

  // ✅ PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // ✅ PWA screenshots
  "/pwa/screenshot-1.png",
  "/pwa/screenshot-2.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // IMPORTANT: don't let one failed request break the whole install
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => null)
        )
      );

      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean older cache versions
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("hvn-static-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );

      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Ignore cross-origin
  if (url.origin !== self.location.origin) return;

  // Ignore Next internals / APIs
  if (url.pathname.startsWith("/api")) return;

  const isNavigation = req.mode === "navigate";

  // Treat as "asset" if it's a static file request
  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    ["/manifest.json", "/service-worker.js", "/icon.svg", "/favicon.ico"].includes(url.pathname) ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  if (isNavigation) {
    // Network-first for pages, fallback to cached page or offline screen
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || (await caches.match("/offline")) || Response.error();
        }
      })()
    );
    return;
  }

  if (isAsset) {
    // Cache-first for assets
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          // If offline and not cached, fail cleanly
          return Response.error();
        }
      })()
    );
  }
});
