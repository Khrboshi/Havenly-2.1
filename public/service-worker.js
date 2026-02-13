/* public/service-worker.js */

/**
 * Fixes:
 * - Prevent cached RSC payloads from being served as HTML during offline navigations.
 * - Offline navigations ALWAYS return /offline.html (never raw RSC payload, never dinosaur).
 * - App Router RSC requests get cached in a separate cache (no key collisions with pages).
 */

const VERSION = "v14";
const STATIC_CACHE = `hvn-static-${VERSION}`; // pages + assets + offline.html
const RSC_CACHE = `hvn-rsc-${VERSION}`; // ONLY RSC payloads

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
  const cache = await caches.open(STATIC_CACHE);
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
          .filter(
            (k) =>
              (k.startsWith("hvn-static-") && k !== STATIC_CACHE) ||
              (k.startsWith("hvn-rsc-") && k !== RSC_CACHE)
          )
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
  if (url.searchParams.has("_rsc")) return true;
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/x-component")) return true;
  // Next internal router headers often exist; accept-based + _rsc covers most cases.
  return false;
}

function normalizeRscKey(url) {
  // Stable cache key for RSC without colliding with document URLs:
  // add a marker param __rsc=1
  const u = new URL(url.toString());
  u.searchParams.delete("_rsc");
  u.searchParams.set("__rsc", "1");
  return u.toString();
}

async function putIn(cacheName, key, response) {
  const cache = await caches.open(cacheName);
  await cache.put(key, response);
}

async function matchIn(cacheName, key, opts) {
  const cache = await caches.open(cacheName);
  return cache.match(key, opts);
}

function isHtmlResponse(res) {
  const ct = res?.headers?.get?.("content-type") || "";
  return ct.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const supabase = !sameOrigin && isSupabaseRequest(url);

  // Only handle: same-origin + Supabase
  if (!sameOrigin && !supabase) return;

  // Never offline-cache arbitrary API routes (except /api/user/plan)
  if (sameOrigin && isApi(url) && !isPlanApi(url)) return;

  const isNavigation = req.mode === "navigate";
  const rsc = sameOrigin && isRSCRequest(req, url);
  const asset = sameOrigin && isAssetRequest(req, url);

  // ---- /api/user/plan: network-first, offline fallback JSON ----
  if (sameOrigin && isPlanApi(url)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          await putIn(STATIC_CACHE, req, fresh.clone());
          return fresh;
        } catch {
          const cached = await matchIn(STATIC_CACHE, req);
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
        const cached = await caches.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          await caches.open(STATIC_CACHE).then((c) => c.put(req, fresh.clone()));
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

  // ---- RSC payloads: cache-first in RSC_CACHE (never STATIC_CACHE) ----
  if (rsc) {
    event.respondWith(
      (async () => {
        const key = new Request(normalizeRscKey(url), { method: "GET" });

        const cached =
          (await matchIn(RSC_CACHE, key)) ||
          (await matchIn(RSC_CACHE, req, { ignoreSearch: true }));

        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          await putIn(RSC_CACHE, key, fresh.clone());
          return fresh;
        } catch {
          // Return empty RSC so the app doesn't hard-crash; navigations will still go to offline.html.
          return new Response("", {
            status: 200,
            headers: { "Content-Type": "text/x-component; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // ---- Navigations: ALWAYS return HTML; if offline => /offline.html ----
  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          await putIn(STATIC_CACHE, req, fresh.clone());

          // Keep "/" updated
          if (url.pathname === "/" || url.pathname === "") {
            await putIn(STATIC_CACHE, new Request("/"), fresh.clone());
          }

          return fresh;
        } catch {
          // Only return cached page if it's actually HTML
          const cachedPage = await matchIn(STATIC_CACHE, req);
          if (cachedPage && isHtmlResponse(cachedPage)) return cachedPage;

          const offline = await matchIn(
            STATIC_CACHE,
            new Request("/offline.html"),
            { ignoreSearch: true }
          );
          if (offline) return offline;

          const cachedHome = await matchIn(
            STATIC_CACHE,
            new Request("/"),
            { ignoreSearch: true }
          );
          if (cachedHome && isHtmlResponse(cachedHome)) return cachedHome;

          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // ---- Assets: cache-first in STATIC_CACHE ----
  if (asset) {
    event.respondWith(
      (async () => {
        const cached =
          (await matchIn(STATIC_CACHE, req)) ||
          (await matchIn(STATIC_CACHE, req, { ignoreSearch: true }));
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          await putIn(STATIC_CACHE, req, fresh.clone());
          return fresh;
        } catch {
          if (req.destination === "image") {
            return (
              (await matchIn(
                STATIC_CACHE,
                new Request("/pwa/icon-192.png"),
                { ignoreSearch: true }
              )) || new Response("", { status: 404 })
            );
          }
          return new Response("", { status: 200 });
        }
      })()
    );
    return;
  }

  // ---- Catch-all same-origin GET: cache-first, then network ----
  event.respondWith(
    (async () => {
      const cached =
        (await matchIn(STATIC_CACHE, req)) ||
        (await matchIn(STATIC_CACHE, req, { ignoreSearch: true }));
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        await putIn(STATIC_CACHE, req, fresh.clone());
        return fresh;
      } catch {
        // If it looks like a document fetch, still serve offline.html
        const accept = req.headers.get("accept") || "";
        if (accept.includes("text/html")) {
          const offline = await matchIn(
            STATIC_CACHE,
            new Request("/offline.html"),
            { ignoreSearch: true }
          );
          if (offline) return offline;
        }
        return new Response("", { status: 200 });
      }
    })()
  );
});
