/* public/service-worker.js */

// Bump this string to force an update.
const CACHE_NAME = "hvn-static-v10";

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

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(
    PRECACHE_URLS.map((url) =>
      cache.add(new Request(url, { cache: "reload" })).catch(() => null)
    )
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await precache();
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
      await self.clients.claim();
    })()
  );
});

// Helper: match cache while ignoring query strings
async function matchIgnoreSearch(request) {
  return caches.match(request, { ignoreSearch: true });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Ignore cross-origin
  if (url.origin !== self.location.origin) return;

  // Ignore API routes
  if (url.pathname.startsWith("/api")) return;

  const isNavigation = req.mode === "navigate";

  // Next.js App Router RSC payloads have ?_rsc=...
  const isRSC = url.searchParams.has("_rsc");

  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/service-worker.js" ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/offline.html" ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font";

  // ---- RSC: cache-first, then safe empty response offline ----
  if (isRSC) {
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
          // Return an empty RSC response so React/Next doesn't crash hard offline
          return new Response("", {
            status: 200,
            headers: { "Content-Type": "text/x-component; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // ---- Pages (navigations): network-first, fallback to cached page, then offline page ----
  if (isNavigation) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const fresh = await fetch(req);

          // Cache the actual visited path so offline navigation can load it later
          cache.put(req, fresh.clone());

          // Also keep "/" always fresh as a safe shell
          if (url.pathname === "/" || url.pathname === "") {
            cache.put("/", fresh.clone());
          }

          return fresh;
        } catch {
          // 1) If this exact page was cached before, use it
          const cachedPage =
            (await caches.match(req)) || (await matchIgnoreSearch(req));
          if (cachedPage) return cachedPage;

          // 2) Final fallback: offline page (prevents Chrome dinosaur)
          const offline = await caches.match("/offline.html");
          if (offline) return offline;

          // 3) As a last resort, try cached "/" shell (may still error offline, but better than dinosaur)
          const cachedHome = await caches.match("/");
          if (cachedHome) return cachedHome;

          return new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // ---- Assets: cache-first (ignore query strings so /icon.svg?... works) ----
  if (isAsset) {
    event.respondWith(
      (async () => {
        const cached =
          (await caches.match(req)) || (await matchIgnoreSearch(req));
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          // If offline and missing, try returning an icon for images
          if (req.destination === "image") {
            return (
              (await caches.match("/pwa/icon-192.png")) ||
              (await matchIgnoreSearch("/pwa/icon-192.png")) ||
              Response.error()
            );
          }
          return Response.error();
        }
      })()
    );
  }
});
