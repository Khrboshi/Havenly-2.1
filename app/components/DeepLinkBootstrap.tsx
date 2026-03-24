"use client";

import { useEffect } from "react";

export default function DeepLinkBootstrap() {
  useEffect(() => {
    const path = window.location.pathname;

    // If user opens via deep link, prevent visual flash
    if (path.startsWith("/auth/callback")) {
      document.documentElement.style.background = "#0b1120";
      document.body.style.opacity = "0.98";
    }
  }, []);

  return null;
}
