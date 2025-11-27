"use client";

import { useEffect, useState } from "react";

// Type for the deferred "beforeinstallprompt" event on Chrome / Android.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const LOCAL_STORAGE_KEY = "havenly_pwa_prompt_dismissed";

export function AddToHomeScreenPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = window.localStorage.getItem(LOCAL_STORAGE_KEY) === "1";
    if (dismissed) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIos(ios);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari standalone mode
      // @ts-expect-error - non-standard property
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Only show on the main landing page.
    const onHomePage = window.location.pathname === "/";
    if (!onHomePage || standalone) return;

    // Handle Chrome / Android "beforeinstallprompt".
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS (no beforeinstallprompt), show a gentle hint after a short delay.
    if (ios && !standalone) {
      const timeout = setTimeout(() => {
        setVisible(true);
      }, 3500);
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        clearTimeout(timeout);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, "1");
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      // If the user dismisses, we still hide, but we don't block forever.
      if (choice.outcome === "accepted") {
        handleClose();
      } else {
        setVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Error during PWA install prompt:", err);
      setVisible(false);
    }
  };

  if (!visible || isStandalone) return null;

  const iosHint =
    "On iPhone: tap the Share icon \u2192 'Add to Home Screen' to keep Havenly as an app.";

  const androidHint =
    "On Android: tap 'Install' below, then confirm to add Havenly 2.1 to your home screen.";

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:px-0">
      <div className="max-w-xl w-full rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 px-4 py-3 sm:px-5 sm:py-4 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
            App
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-50">
              Add Havenly 2.1 to your home screen
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              {isIos ? iosHint : androidHint}
            </p>
            <div className="mt-3 flex items-center gap-3">
              {!isIos && deferredPrompt && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Install Havenly
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline-offset-2 hover:underline"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
