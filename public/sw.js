// Minimal service worker for Havenly 2.1
// Just enough to make the app installable as a PWA.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// No fetch handler for now – the app will use the network as normal.
// You can extend this later for offline caching if desired.
