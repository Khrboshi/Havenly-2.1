"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        const alreadyRegistered = regs.some((r) =>
          r.active?.scriptURL.includes("service-worker.js")
        );

        if (!alreadyRegistered) {
          navigator.serviceWorker.register("/service-worker.js", {
            scope: "/",
          });
        }
      });
    }
  }, []);

  return null;
}
