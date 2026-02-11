"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register in production, in browsers that support SW
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/service-worker.js", {
          scope: "/",
        });

        // Optional: auto-update when a new SW is found
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            // When activated, the new SW will control after reload
            if (installing.state === "activated") {
              // no-op (you can show a toast later if you want)
            }
          });
        });

        // Ensure we check for updates after load
        window.addEventListener("load", () => {
          reg.update().catch(() => null);
        });
      } catch {
        // silent fail (PWA should never block the app)
      }
    };

    register();
  }, []);

  return null;
}
