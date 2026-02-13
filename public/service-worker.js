/* public/service-worker.js */

const CACHE_NAME = "hvn-static-v13";

// Minimal, deterministic precache for offline UX.
// Everything else is runtime-cached.
const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icon.svg",
  "/favicon.ico",

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

function isSupabaseRequest(url) {
  return (
    typeof url?.hostname === "string" &&
    url.hostname.endsWith(".supabase.co") &&
    (url.pathname.startsWith("/rest/") ||
      url.pathname.startsWith("/auth/") ||
      url.pathname.startsWith("/storage/"))
  );
}

function isPlanApi(url) {
  return url.origin === self.location.origin && url.pathname === "/api/user/plan";
}

function isApi(url) {
  return url.origin === self.location.origin && url.pathname.startsWith("/api/");
}

function isAssetRequest(req, url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pwa/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/service-worker.js" ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/offline.html" ||
    url.pathname === "/favicon.ico" ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font"
  );
}

function isRSCRequest(req, url) {
  // Next.js App Router RSC payloads usually have ?_rsc=...
  if (url.searchParams.has("_rsc")) return true;

  // Some environments rely on the Accept header
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/x-component")) return true;

  return false;
}

function normalizedRscKey(url) {
  // Make a stable cache key by stripping the _rsc query param (it changes per navigation)
  const u = new URL(url.toString());
  u.searchParams.delete("_rsc");
  // Keep other search params (if any) stable
  // Normalize empty search to no "?"
  if ([...u.searchParams.keys()].length === 0) {
    u.search = "";
  }
  return u.toString();
}

async function cachePut(key, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(key, response);
}

async function cacheMatch(reqOrKey, opts) {
  return caches.match(reqOrKey, opts);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  const sameOrigin = url.origin === self.location.origin;
  const supabase = !sameOrigin && isSupabaseRequest(url);

  // Only handle: same-origin + Supabase
  if (!sameOrigin && !supabase) return;

  // Never try to offline-cache arbitrary API routes (except /api/user/plan)
  if (sameOrigin && isApi(url) && !isPlanApi(url)) return;

  const isNavigation = req.mode === "navigate";
  const isRSC = sameOrigin && isRSCRequest(req, url);
  const isAsset = sameOrigin && isAssetRequest(req, url);

  // ---- /api/user/plan: network-first, offline fallback JSON (prevents noisy errors) ----
  if (sameOrigin && isPlanApi(url)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          await cachePut(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await cacheMatch(req);
          if (cached) return cached;

          return new Response(
            JSON.stringify({
              planType: "FREE",
              plan: "FREE",
              credits: 0,
              renewalDate: null,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store, max-age=0",
              },
            }
          );
        }
      })()
    );
    return;
  }

  // ---- Supabase GET: cache-first for offline usability ----
  if (supabase) {
    event.respondWith(
      (async () => {
        const cached = await cacheMatch(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          await cachePut(req, fresh.clone());
          return fresh;
        } catch {
          return new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // ---- RSC payloads: cache-first with stable key (eliminates most offline red errors) ----
  if (isRSC) {
    event.respondWith(
      (async () => {
        const stableKey = normalizedRscKey(url);
        const cacheKey = new Request(stableKey, { method: "GET" });

        const cached =
          (await cacheMatch(cacheKey)) ||
          (await cacheMatch(req,
