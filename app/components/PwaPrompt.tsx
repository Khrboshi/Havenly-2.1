// components/PwaPrompt.tsx
"use client";

import { useEffect, useState } from "react";

export default function PwaPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as any).standalone === true;

    if (isMobile && !isStandalone) {
      setTimeout(() => setShow(true), 1200);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#0d1624] text-slate-100 p-4 rounded-xl shadow-lg border border-white/10 z-50">
      <p className="text-sm font-medium mb-2">
        Add Havenly 2.1 to your home screen
      </p>
      <p className="text-xs text-slate-400 mb-3">
        Tap Share → Add to Home Screen to install Havenly 2.1 as an app.
      </p>
      <button
        className="text-xs text-slate-400 underline"
        onClick={() => setShow(false)}
      >
        Dismiss
      </button>
    </div>
  );
}
