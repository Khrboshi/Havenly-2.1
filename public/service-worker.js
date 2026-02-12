const CACHE_NAME = "hvn-static-v7";

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon.svg",

  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

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

  if (url.origin !== self.location.origin) return;
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

  // ---------- PAGES ----------
  if (isNavigation) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const fresh = await fetch(req);
          cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cachedHome = await caches.match("/");
          if (cachedHome) return cachedHome;
          return new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // ---------- ASSETS ----------
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
