"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
        // console.log("Service worker registered");
      } catch (err) {
        console.error("Service worker registration failed:", err);
      }
    };

    // Register as soon as the page is loaded.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  // No UI; this component only runs side effects.
  return null;
}
