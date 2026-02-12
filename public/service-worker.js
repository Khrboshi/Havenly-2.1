/* public/service-worker.js */

// A lightweight SW that makes the site work offline after 1 successful online load.
//
// Important:
// Next.js App Router issues background RSC requests like:
//   /about?_rsc=XXXX
// If those fail offline, Next can fall back to a hard navigation (showing a blank/offline page).
// This SW handles those RSC requests and falls back to a cached shell.

const CACHE_PREFIX = "hvn";
const CACHE_VERSION = "v7";
const CACHE_NAME = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icon.svg",

  // PWA icons
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",

  // PWA screenshots
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
          .filter((k) => k.startsWith(`${CACHE_PREFIX}-static-`) && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );

      self.clients.claim();
    })()
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isRSCRequest(req, url) {
  // The query param is the most reliable signal based on your current logs.
  if (url.searchParams.has("_rsc")) return true;

  // Defensive: some builds may use headers too.
  const rscHeader = req.headers.get("RSC");
  return rscHeader === "1" || rscHeader === "true";
}

async function cacheFirst(req, cacheKey) {
  const cached = await caches.match(cacheKey || req);
  if (cached) return cached;

  const fresh = await fetch(req);
  if (fresh && fresh.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(cacheKey || req, fresh.clone());
  }
  return fresh;
}

async function networkFirst(req, cacheKey, fallbackUrls = []) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) {
      await cache.put(cacheKey || req, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match(cacheKey || req);
    if (cached) return cached;

    for (const u of fallbackUrls) {
      const fb = await caches.match(u);
      if (fb) return fb;
    }

    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (!isSameOrigin(url)) return;

  // Skip API calls (don’t cache auth/session APIs)
  if (url.pathname.startsWith("/api")) return;

  const isNavigation = req.mode === "navigate";
  const rsc = isRSCRequest(req, url);

  const isNextStatic = url.pathname.startsWith("/_next/static/");
  const isImageOpt = url.pathname === "/_next/image";

  const isPublicAsset =
    url.pathname.startsWith("/pwa/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/service-worker.js" ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/offline.html" ||
    url.pathname.startsWith("/favicon");

  const isAsset =
    isNextStatic ||
    isPublicAsset ||
    isImageOpt ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  // 1) Navigations: network-first, fallback to cached route, then cached shell, then offline page
  if (isNavigation) {
    const routeKey = url.pathname === "/" ? "/" : url.pathname;

    event.respondWith(
      networkFirst(req, routeKey, ["/", "/offline.html"])
    );
    return;
  }

  // 2) RSC: network-first, fallback to cached RSC (if any), then cached shell
  if (rsc) {
    // Keep full URL (including _rsc) as the cache key so we can reuse it if it was fetched once.
    const cacheKey = url.pathname + url.search;

    event.respondWith(
      networkFirst(req, cacheKey, ["/"])
    );
    return;
  }

  // 3) Assets: cache-first (works great for _next/static and /pwa/*)
  if (isAsset) {
    // Cache key should ignore irrelevant query strings for static assets.
    // For _next/image we keep the full request, because query encodes size/url.
    const cacheKey = isImageOpt ? req : url.pathname;

    event.respondWith(
      (async () => {
        try {
          return await cacheFirst(req, cacheKey);
        } catch {
          // If offline and missing, provide a safe image fallback.
          if (req.destination === "image") {
            return (await caches.match("/pwa/icon-192.png")) || Response.error();
          }
          return Response.error();
        }
      })()
    );
  }
});
