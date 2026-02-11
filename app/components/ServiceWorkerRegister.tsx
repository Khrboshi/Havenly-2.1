"use client";

export default function ServiceWorkerRegister() {
  if (process.env.NODE_ENV !== "production") return null;

  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        // silent fail (do not block UX)
      });
    });
  }

  return null;
}
