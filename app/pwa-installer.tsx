"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone mode
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as any).standalone === true;

    setIsStandalone(standalone);

    // Basic iOS detection (for install hint)
    const ua = window.navigator.userAgent || "";
    const ios =
      /iPhone|iPad|iPod/.test(ua) && !("MSStream" in window) && !standalone;
    setIsIos(ios);

    // Register a very small service worker for PWA installability
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed", err));
    }

    // Capture beforeinstallprompt for Android / desktop Chrome
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone) return null;

  const shouldShow =
    showBanner || (isIos && !isStandalone); // show hint on iOS even without event

  if (!shouldShow) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowBanner(false);
      return;
    }

    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (err) {
      console.error("Install prompt failed", err);
    } finally {
      setShowBanner(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-4 sm:px-4 sm:pb-5">
      <div className="mx-auto max-w-xl rounded-2xl bg-slate-900/95 px-4 py-3 shadow-lg ring-1 ring-slate-700 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-semibold text-emerald-300">
            +
          </div>
          <div className="flex-1 text-xs text-slate-200 sm:text-sm">
            <p className="font-medium text-slate-50">
              Add Havenly 2.1 to your home screen
            </p>
            {deferredPrompt ? (
              <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                Install the app for one-tap access and a calmer daily check-in.
              </p>
            ) : isIos ? (
              <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                On iPhone: tap{" "}
                <span className="font-semibold">Share</span> →{" "}
                <span className="font-semibold">Add to Home Screen</span> to
                keep Havenly 2.1 as an app.
              </p>
            ) : null}
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-1 text-xs text-slate-400 hover:text-slate-100"
            aria-label="Close install hint"
          >
            ✕
          </button>
        </div>

        {deferredPrompt && (
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowBanner(false)}
              className="rounded-full px-3 py-1 text-[11px] text-slate-300 hover:text-white"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-medium text-slate-950 hover:bg-emerald-400"
            >
              Install app
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
