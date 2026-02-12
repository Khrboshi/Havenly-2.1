/* public/service-worker.js */
const CACHE_NAME = "hvn-static-v5";

/**
 * Precache essentials:
 * - App shell (/) + manifest
 * - Site icon(s) used in Navbar (fixes “logo broken offline”)
 * - PWA icons + screenshots
 *
 * NOTE:
 * - We intentionally DO NOT precache /offline unless you truly have that route.
 *   (Missing /offline is a common reason precache silently skips items.)
 */
const PRECACHE_URLS = [
  "/",
  "/manifest.json",

  // ✅ Site icon(s)
  "/icon.svg",

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

      // Use cache: 'reload' so we don’t get stale/HTML-cached responses.
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => null)
        )
      );

      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
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

  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    ["/manifest.json", "/service-worker.js", "/icon.svg"].includes(url.pathname) ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  // ----------------------------
  // Pages: network-first, fallback to cached "/" (app shell)
  // ----------------------------
  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          // Fallback to cached request, then cached home
          const cached = await caches.match(req);
          return cached || (await caches.match("/")) || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // ----------------------------
  // Assets: cache-first
  // ----------------------------
  if (isAsset) {
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
          // If an image is missing offline, try returning the cached app icon.
          if (req.destination === "image") {
            return (await caches.match("/pwa/icon-192.png")) || Response.error();
          }
          return Response.error();
        }
      })()
    );
  }
});
