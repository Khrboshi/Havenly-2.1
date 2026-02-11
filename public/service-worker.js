/* public/service-worker.js */

const CACHE_VERSION = "hvn-sw-v1";
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const CORE_ASSETS = ["/", "/manifest.json", "/icon.svg"];

// Install: cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(RUNTIME_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch strategy:
// - Navigation: network-first, fallback to cached "/" (helps offline open)
// - Static assets (scripts/styles/images/fonts): stale-while-revalidate
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only same-origin
  if (url.origin !== self.location.origin) return;

  // Navigation requests
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(RUNTIME_CACHE);
          return (
            (await cache.match(req)) ||
            (await cache.match("/")) ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          );
        }
      })()
    );
    return;
  }

  // Static assets
  const destination = req.destination; // "script" | "style" | "image" | "font" | ...
  const isStatic =
    destination === "script" ||
    destination === "style" ||
    destination === "image" ||
    destination === "font";

  if (isStatic) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(req);

        const fetchPromise = fetch(req)
          .then((fresh) => {
            cache.put(req, fresh.clone());
            return fresh;
          })
          .catch(() => null);

        // Return cached immediately if available, update in background
        if (cached) return cached;

        // Else wait for network
        const fresh = await fetchPromise;
        if (fresh) return fresh;

        return new Response("", { status: 504, statusText: "Offline" });
      })()
    );
  }
});
