/* public/service-worker.js */
const CACHE_NAME = "hvn-static-v7";

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon.svg",

  // PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // Screenshots
  "/pwa/screenshots/screenshot-1.png",
  "/pwa/screenshots/screenshot-2.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

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

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // same-origin only
  if (url.origin !== self.location.origin) return;

  // ignore APIs
  if (url.pathname.startsWith("/api")) return;

  const isNavigation = req.mode === "navigate";
  const isRSC = url.searchParams.has("_rsc");

  // Next.js Image optimizer endpoint
  const isNextImage = url.pathname.startsWith("/_next/image");

  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    ["/manifest.json", "/service-worker.js", "/icon.svg"].includes(url.pathname) ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  // ---- RSC: return cached shell when offline ----
  if (isRSC) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        return cached || (await caches.match("/", { ignoreSearch: true })) || new Response("Offline", { status: 503 });
      })()
    );
    return;
  }

  // ---- Next/Image: if offline, fall back to original image or cached icon ----
  if (isNextImage) {
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
          // try to serve the original image referenced in ?url=
          const originalPath = url.searchParams.get("url");
          if (originalPath && originalPath.startsWith("/")) {
            const originalCached = await caches.match(originalPath, { ignoreSearch: true });
            if (originalCached) return originalCached;
          }
          return (await caches.match("/pwa/icon-192.png", { ignoreSearch: true })) || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // ---- Pages: network-first, fallback to cached page or cached "/" ----
  if (isNavigation) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const fresh = await fetch(req);

          // Keep the app shell fresh for offline fallback
          cache.put("/", fresh.clone());
          cache.put(req, fresh.clone());

          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || (await caches.match("/", { ignoreSearch: true })) || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // ---- Assets: cache-first (ignoreSearch fixes /icon.svg?v=123) ----
  if (isAsset) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          if (req.destination === "image") {
            return (await caches.match("/pwa/icon-192.png", { ignoreSearch: true })) || new Response("", { status: 503 });
          }
          return new Response("", { status: 503 });
        }
      })()
    );
  }
});
