// public/sw.js
// Minimal service worker for Havenly 2.1
// Currently focuses on making the app installable and ready for future offline support.

const CACHE_NAME = "havenly-shell-v1";
const SHELL_URLS = ["/", "/blog", "/about", "/magic-login"];

// Install: pre-cache the basic shell (can be extended later).
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_URLS).catch(() => {
        // If any URL fails (e.g., during first deploy), we still want install to succeed.
        return;
      });
    })
  );
  self.skipWaiting();
});

// Activate: clear old caches if you bump CACHE_NAME.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache for navigation + same-origin requests.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests.
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Optionally cache the response.
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || fetch(request))
      )
  );
});
