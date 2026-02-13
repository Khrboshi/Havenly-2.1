// public/service-worker.js

const VERSION = "v18"; // bump version to force SW refresh
const STATIC_CACHE = `hvn-static-${VERSION}`;

const PRECACHE_URLS = [
  "/offline.html",
  "/manifest.json",
  "/icon.svg",
  "/favicon.ico",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",
  "/pwa/screenshots/screenshot-1.png",
  "/pwa/screenshots/screenshot-2.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(
        PRECACHE_URLS.map((u) =>
          cache.add(new Request(u, { cache: "reload" })).catch(() => null)
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
          .filter((k) => k.startsWith("hvn-static-") && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function shouldBypass(reqUrl) {
  const url = new URL(reqUrl);

  // ✅ Never touch Next App Router internals / RSC payloads / runtime chunks
  if (url.searchParams.has("_rsc")) return true;
  if (url.pathname.startsWith("/_next/")) return true;

  // ✅ Never touch API routes
  if (url.pathname.startsWith("/api/")) return true;

  // ✅ Never touch auth callback-like endpoints if you ever add them as non-/api
  // (keeps magic link flows safe)
  if (url.pathname.startsWith("/auth/")) return true;

  return false;
}

function isCacheableAsset(req) {
  // Only cache truly static assets, not HTML/RSC
  const url = new URL(req.url);

  if (shouldBypass(req.url)) return false;

  // Don’t cache navigations (HTML pages)
  if (req.mode === "navigate") return false;

  // Cache only images/fonts/css/js/icons + your /pwa assets + manifest/offline
  const path = url.pathname;

  if (path.startsWith("/pwa/")) return true;
  if (path === "/manifest.json") return true;
  if (path === "/offline.html") return true;

  return (
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".webp") ||
    path.endsWith(".svg") ||
    path.endsWith(".ico") ||
    path.endsWith(".css") ||
    path.endsWith(".js") ||
    path.endsWith(".woff") ||
    path.endsWith(".woff2") ||
    path.endsWith(".ttf")
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle same-origin GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // ✅ Hard bypass for Next internals + RSC + api
  if (shouldBypass(req.url)) return;

  // ✅ Offline fallback for navigations ONLY (do NOT cache navigations)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch {
          const cache = await caches.open(STATIC_CACHE);
          const offline = await cache.match("/offline.html", {
            ignoreSearch: true,
          });
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

  // ✅ Cache-first ONLY for safe static assets
  if (isCacheableAsset(req)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);

        const cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          // Cache only successful responses
          if (fresh && fresh.ok) await cache.put(req, fresh.clone());
          return fresh;
        } catch {
          // If asset fetch fails, return empty 200 (prevents hard crashes)
          return new Response("", { status: 200 });
        }
      })()
    );
    return;
  }

  // Everything else: network only (no caching)
  return;
});
