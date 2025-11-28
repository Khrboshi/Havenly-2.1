"use client";

import { useEffect, useState } from "react";

export default function PwaInstallHint() {
  const [show, setShow] = useState(false);
  const [promptEvent, setPromptEvent] = useState<any>(null);

  useEffect(() => {
    // Detect mobile only (avoid showing on desktop)
    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);

    if (!isMobile) return; // Desktop → do not show

    // Detect if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as any).standalone === true);

    if (isStandalone) return;

    // Listen for beforeinstallprompt (Android)
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS → manually show hint
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      setTimeout(() => setShow(true), 1000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show) return null;

  async function installApp() {
    if (promptEvent) {
      promptEvent.prompt();
      const res = await promptEvent.userChoice;
      console.log("Install result:", res);
    }
    setShow(false);
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl animate-fade-in max-w-xs text-center">
        <p className="text-sm font-medium">
          Install Havenly for a faster app-like experience.
        </p>

        {/* Android Install Button */}
        {promptEvent && (
          <button
            onClick={installApp}
            className="mt-2 bg-white text-emerald-700 px-3 py-1 rounded-lg font-semibold text-sm"
          >
            Install App
          </button>
        )}

        {/* iOS Manual Instructions */}
        {!promptEvent && (
          <p className="text-xs mt-2 opacity-90">
            Tap Share → Add to Home Screen
          </p>
        )}
      </div>
    </div>
  );
}
