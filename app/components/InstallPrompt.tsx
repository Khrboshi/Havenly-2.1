"use client";

import React, { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  // iOS Safari: navigator.standalone
  // Other: display-mode: standalone
  return (
    (typeof window !== "undefined" &&
      (window.matchMedia?.("(display-mode: standalone)")?.matches ?? false)) ||
    // @ts-expect-error - iOS Safari only
    (typeof navigator !== "undefined" && navigator.standalone === true)
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  // "safari" present but not chrome/android
  return ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios") && !ua.includes("android");
}

const DISMISS_KEY = "havenly_install_prompt_dismissed_v1";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  const platform = useMemo(() => {
    const ios = isIOS();
    if (ios && isSafari()) return "ios_safari";
    if (ios) return "ios_other";
    return "other";
  }, []);

  useEffect(() => {
    // Don’t show if already installed
    if (isStandalone()) return;

    // Don’t show if user dismissed before
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    // Android/desktop: capture the install prompt
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // iOS Safari: no beforeinstallprompt — show an instructional prompt
    if (platform === "ios_safari") {
      // Small delay so it doesn’t pop instantly on first paint
      const t = window.setTimeout(() => setShow(true), 1200);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, [platform]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    // Hide after user acts
    setShow(false);
    setDeferredPrompt(null);

    // If dismissed, don’t annoy them again
    if (choice.outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  if (!show) return null;

  // If iOS Safari, show instructions (no programmatic prompt exists)
  if (platform === "ios_safari") {
    return (
      <div className="fixed bottom-4 left-1/2 z-50 w-[min(520px,calc(100%-24px))] -translate-x-1/2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-slate-200 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white">Install Havenly</div>
              <div className="mt-1 text-sm text-slate-300">
                To install on iPhone: tap <span className="font-semibold text-slate-100">Share</span> →{" "}
                <span className="font-semibold text-slate-100">Add to Home Screen</span>.
              </div>
            </div>
            <button
              onClick={dismiss}
              className="rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900/70"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android/desktop prompt
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(520px,calc(100%-24px))] -translate-x-1/2">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-slate-200 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">Install Havenly</div>
            <div className="mt-1 text-sm text-slate-300">
              Add Havenly to your home screen for a faster, full-screen experience.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={dismiss}
              className="rounded-full border border-slate-700 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/70"
            >
              Not now
            </button>
            <button
              onClick={install}
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:opacity-90"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
