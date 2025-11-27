"use client";

import { useEffect, useState } from "react";

export default function AddToHomeScreenPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : ""
    );

    // Only show on mobile
    if (isMobile) {
      const timeout = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timeout);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 bg-emerald-900/70 border border-emerald-700 text-white p-4 rounded-xl backdrop-blur-md shadow-lg text-sm z-50">
      <b>Add Havenly 2.1 to your home screen</b>
      <p className="mt-1 opacity-90">
        On iPhone: tap Share → Add to Home Screen.
      </p>
      <button
        className="mt-2 text-xs underline opacity-80"
        onClick={() => setVisible(false)}
      >
        Close
      </button>
    </div>
  );
}
