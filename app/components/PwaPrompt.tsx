"use client";

import { useEffect, useState } from "react";

export default function PwaPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      setTimeout(() => setVisible(true), 2000);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-emerald-700/60 bg-emerald-800/80 p-4 text-slate-50 backdrop-blur">
      <b>Add Havenly to your home screen</b>
      <p className="text-xs opacity-90 mt-1">
        Tap Share → Add to Home Screen.
      </p>

      <button
        className="text-xs underline mt-2 opacity-80"
        onClick={() => setVisible(false)}
      >
        Close
      </button>
    </div>
  );
}
