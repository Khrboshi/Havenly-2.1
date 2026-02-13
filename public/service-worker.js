/* public/service-worker.js */
const CACHE_NAME = "hvn-static-v7";

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icon.svg",

  // PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // Screenshots
  "/pwa/screenshots/screenshot-1.png",
  "/pwa/screenshots/screenshot-2.png",
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

  // Same-origin only
  if (url.origin !== self.location.origin) return;

  // Ignore API routes
  if (url.pathname.startsWith("/api")) return;

  const isNavigation = req.mode === "navigate";
  const isRSC = url.searchParams.has("_rsc");

  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    ["/manifest.json", "/service-worker.js", "/icon.svg", "/offline.html"].includes(url.pathname) ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  // ----------------------------
  // RSC requests (Next App Router): never let them hard-fail offline
  // ----------------------------
  if (isRSC) {
    event.respondWith(
      (async () => {
        // If we already cached this exact RSC request, use it.
        const cached = await caches.match(req);
        if (cached) return cached;

        // Otherwise, return a lightweight offline HTML so the app won't crash into browser offline page
        const offline = await caches.match("/offline.html");
        return (
          offline ||
          new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        );
      })()
    );
    return;
  }

  // ----------------------------
  // Navigations: network-first, fallback to cached page, then "/", then offline.html
  // ----------------------------
  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);

          // Cache the successful navigation response for later offline use
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());

          // Keep "/" fresh when visiting home
          if (url.pathname === "/") {
            cache.put("/", fresh.clone());
          }

          return fresh;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;

          const cachedHome = await caches.match("/");
          if (cachedHome) return cachedHome;

          const offline = await caches.match("/offline.html");
          return (
            offline ||
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })()
    );
    return;
  }

  // ----------------------------
  // Assets: cache-first, then network + store, fallback for images
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
          if (req.destination === "image") {
            return (await caches.match("/pwa/icon-192.png")) || Response.error();
          }
          return Response.error();
        }
      })()
    );
  }
});
