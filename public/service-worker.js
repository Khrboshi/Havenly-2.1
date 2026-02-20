const VERSION = "v20";
const STATIC_CACHE = `hvn-static-${VERSION}`;

const PRECACHE_URLS = [
  "/offline.html",
  "/manifest.json",
  "/icon.svg",
  "/favicon.ico",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",
];

// -------- install: precache minimal shell assets --------
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

// -------- activate: cleanup old caches --------
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

// -------- rules --------
function shouldBypass(req) {
  const url = new URL(req.url);

  // Next.js app router / RSC requests:
  // These MUST NOT be cached or interfered with.
  if (url.searchParams.has("_rsc")) return true;

  // Next.js internal assets & build output
  if (url.pathname.startsWith("/_next/")) return true;

  // APIs / auth should never be handled here
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/auth/")) return true;

  return false;
}

function isStaticAssetRequest(req) {
  // Only cache non-navigation requests for obvious static assets
  if (req.method !== "GET") return false;
  if (req.mode === "navigate") return false;
  if (shouldBypass(req)) return false;

  const url = new URL(req.url);
  const path = url.pathname;

  // Explicit app assets
  if (path.startsWith("/pwa/")) return true;
  if (path === "/manifest.json") return true;
  if (path === "/offline.html") return true;
  if (path === "/icon.svg") return true;
  if (path === "/favicon.ico") return true;

  // Common asset extensions
  return (
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".webp") ||
    path.endsWith(".svg") ||
    path.endsWith(".ico") ||
    path.endsWith(".woff") ||
    path.endsWith(".woff2") ||
    path.endsWith(".ttf")
  );
}

// Stale-while-revalidate for assets:
// return cache immediately (if any) then update in background.
async function staleWhileRevalidate(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);

  const fetchPromise = fetch(req)
    .then((fresh) => {
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    })
    .catch(() => null);

  // If we have cached, return it immediately
  if (cached) {
    // Update in background
    self.registration && fetchPromise.catch(() => null);
    return cached;
  }

  // Otherwise wait for network
  const fresh = await fetchPromise;
  return (
    fresh ||
    new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  );
}

// Network-first for navigations (HTML), fallback to offline.html if offline.
async function networkFirstNavigation(req) {
  try {
    return await fetch(req);
  } catch {
    const cache = await caches.open(STATIC_CACHE);
    const offline = await cache.match("/offline.html");
    return (
      offline ||
      new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // only same-origin GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // never touch Next.js RSC/internal/API/auth
  if (shouldBypass(req)) return;

  // navigations: network-first fallback
  if (req.mode === "navigate") {
    event.respondWith(networkFirstNavigation(req));
    return;
  }

  // assets: stale-while-revalidate
  if (isStaticAssetRequest(req)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // everything else: do nothing (let browser handle)
});
