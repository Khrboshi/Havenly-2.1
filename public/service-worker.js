self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic offline fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("havenly-cache").then(async (cache) => {
      const cached = await cache.match(event.request);
      const fetched = fetch(event.request).catch(() => cached);

      if (fetched) {
        cache.put(event.request, fetched.clone());
      }

      return fetched || cached || Response.error();
    })
  );
});
