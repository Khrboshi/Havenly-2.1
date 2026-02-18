"use client";

import { useEffect, useMemo, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BIPEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platformHint, setPlatformHint] = useState<"ios" | "other">("other");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    setPlatformHint(isiOS ? "ios" : "other");

    const checkInstalled = () => {
      const standalone =
        window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
        (window.navigator as any)?.standalone === true; // iOS Safari
      setIsInstalled(standalone);
    };

    checkInstalled();

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const onBeforeInstallPrompt = (e: Event) => {
      // IMPORTANT: without preventDefault, Chrome may show its own mini-infobar and you can't trigger it later
      e.preventDefault();
      setDeferredPrompt(e as BIPEvent);
    };

    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as any);

    const mq = window.matchMedia?.("(display-mode: standalone)");
    const onModeChange = () => checkInstalled();
    mq?.addEventListener?.("change", onModeChange);

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as any);
      mq?.removeEventListener?.("change", onModeChange);
    };
  }, []);

  const canInstall = useMemo(() => !!deferredPrompt && !isInstalled, [deferredPrompt, isInstalled]);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      // If accepted, appinstalled event will usually fire shortly after.
      if (choice.outcome !== "accepted") {
        // user dismissed; keep instructions visible
      }
    } finally {
      // Prompt can only be used once
      setDeferredPrompt(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-10 md:pt-16">
      <h1 className="text-3xl font-semibold text-white">Install</h1>
      <p className="mt-2 text-slate-300">
        Installing creates an app icon and improves the login experience from email links.
      </p>

      {isInstalled ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Already installed</h2>
          <p className="mt-2 text-slate-300">
            This device already has Havenly installed. You can hide the Install tab automatically
            (your navbar logic handles this in standalone mode).
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Install on this device</h2>

          {canInstall ? (
            <>
              <p className="mt-2 text-slate-300">
                Your browser supports one-click install.
              </p>
              <button
                onClick={handleInstallClick}
                className="mt-4 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-black hover:bg-emerald-400"
              >
                Install Havenly
              </button>
              <p className="mt-3 text-xs text-slate-400">
                If you don’t see the button in Incognito, open a normal browser window.
              </p>
            </>
          ) : (
            <>
              {platformHint === "ios" ? (
                <div className="mt-2 text-slate-300">
                  <p>
                    On iPhone/iPad (Safari): tap <b>Share</b> → <b>Add to Home Screen</b>.
                  </p>
                </div>
              ) : (
                <div className="mt-2 text-slate-300">
                  <p className="font-medium text-white">Desktop (Chrome/Edge)</p>
                  <ol className="mt-2 list-decimal space-y-2 pl-5">
                    <li>Open this site in a normal (non-Incognito) window.</li>
                    <li>
                      Click the install icon in the address bar (if shown) <b>or</b> open the browser
                      menu (⋮).
                    </li>
                    <li>Select <b>Install Havenly…</b></li>
                  </ol>
                  <p className="mt-3 text-xs text-slate-400">
                    If the install option never appears, the app may not meet installability
                    requirements (manifest/service worker) or it may already be installed.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
