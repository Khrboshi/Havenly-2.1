"use client";

import { useEffect } from "react";

export default function DeepLinkBootstrap() {
  useEffect(() => {
    // If the app was opened via a deep link, this event can be used later
    // (especially when adding Capacitor/App Links).
    if (window.location.pathname.startsWith("/auth/callback")) {
      window.dispatchEvent(new Event("deep-link-opened"));
    }
  }, []);

  return null;
}
