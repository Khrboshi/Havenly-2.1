const VERSION = "v17";
const STATIC_CACHE = `hvn-static-${VERSION}`;
const RSC_CACHE = `hvn-rsc-${VERSION}`;

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

function isRSC(req, url) {
  if (url.searchParams.has("_rsc")) return true;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/x-component");
}

function normalizeRscKey(url) {
  const u = new URL(url.toString());
  u.searchParams.delete("_rsc");
  u.searchParams.set("__rsc", "1");
  return u.toString();
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // NEVER cache API responses (prevents cache poisoning / stale auth)
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // 1) RSC payloads: separate cache
  if (isRSC(req, url)) {
    event.respondWith(
      (async () => {
        const key = new Request(normalizeRscKey(url), { method: "GET" });
        const cache = await caches.open(RSC_CACHE);

        const cached = await cache.match(key);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          await cache.put(key, fresh.clone());
          return fresh;
        } catch {
          return new Response("", {
            status: 200,
            headers: { "Content-Type": "text/x-component; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // 2) Navigations: if offline => ALWAYS offline.html (never home, never other cached page)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(STATIC_CACHE);
          await cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(STATIC_CACHE);
          const offline = await cache.match("/offline.html", {
            ignoreSearch: true,
          });

          if (offline) return offline;

          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })()
    );
    return;
  }

  // 3) Assets: cache-first
  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
      } catch {
        return new Response("", { status: 200 });
      }
    })()
  );
});
