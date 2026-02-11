"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Only run in browsers that support SW
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Allow on https or localhost
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    const isHttps = window.location.protocol === "https:";

    if (!isHttps && !isLocalhost) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/service-worker.js", {
          scope: "/",
        });

        // Optional: log updates
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            // When a new SW is installed and there's an existing controller,
            // it means an update is ready.
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // You can later show a toast “Update available — refresh”
              // For now we keep it quiet to avoid breaking UX.
              // console.log("New content is available; refresh to update.");
            }
          });
        });
      } catch (err) {
        // Fail silently — SW is an enhancement, not required
        // console.warn("SW registration failed", err);
      }
    };

    register();
  }, []);

  return null;
}
