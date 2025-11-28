"use client";

import { useEffect, useState } from "react";

export default function PwaInstallHint() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Already installed (standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // iOS standalone check
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = window.navigator.standalone === true;

    if (isIOS && !isInStandalone) {
      // iOS cannot trigger install prompt
      setVisible(true);
    }

    // Android install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-3 bg-white text-slate-900 shadow-lg rounded-full z-50 flex gap-3 items-center animate-fade-in">
      <span className="text-sm font-medium">Install Havenly?</span>
      {deferredPrompt && (
        <button
          onClick={install}
          className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-full"
        >
          Install
        </button>
      )}
    </div>
  );
}
