/* public/service-worker.js */
const CACHE_NAME = "hvn-static-v6";

/**
 * Precache essentials:
 * - App shell + offline page
 * - manifest + icons + screenshots
 */
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",

  // Navbar/site icons
  "/icon.svg",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/favicon-16.png",

  // PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // PWA screenshots (✅ correct folder)
  "/pwa/screenshots/screenshot-1.png",
  "/pwa/screenshots/screenshot-2.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // cache: 'reload' helps avoid accidentally caching HTML for assets
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

  // Ignore APIs
  if (url.pathname.startsWith("/api")) return;

  // ✅ Next.js App Router RSC requests look like /?_rsc=...
  const isRSC = url.searchParams.has("_rsc");
  if (isRSC) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        return (await caches.match("/")) || new Response("Offline", { status: 503 });
      })()
    );
    return;
  }

  const isNavigation = req.mode === "navigate";

  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    ["/manifest.json", "/service-worker.js", "/icon.svg", "/favicon.ico", "/favicon-16.png", "/apple-touch-icon.png"].includes(url.pathname) ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  // Pages: network-first, fallback to cached page or offline screen
  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || (await caches.match("/offline")) || (await caches.match("/")) || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Assets: cache-first
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
          // If offline and image missing, fallback to cached app icon
          if (req.destination === "image") {
            return (await caches.match("/pwa/icon-192.png")) || Response.error();
          }
          return Response.error();
        }
      })()
    );
  }
});
