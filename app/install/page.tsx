"use client";

import { useMemo } from "react";
import { useInstallAvailability } from "@/app/hooks/useInstallAvailability";

export default function InstallPage() {
  const { isStandalone, isIOS, isSafariIOS, canPromptNative, promptInstall } = useInstallAvailability();

  const platformHint = useMemo(() => (isIOS ? "ios" : "other"), [isIOS]);

  async function handleInstallClick() {
    if (!canPromptNative) return;
    await promptInstall();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-10 md:pt-16">
      <h1 className="text-3xl font-semibold text-white">Install</h1>
      <p className="mt-2 text-slate-300">
        Installing creates an app icon and improves the login experience from email links.
      </p>

      {isStandalone ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Already installed</h2>
          <p className="mt-2 text-slate-300">
            Havenly is currently running in installed (standalone) mode on this device.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Install on this device</h2>

          {canPromptNative ? (
            <>
              <p className="mt-2 text-slate-300">Your browser supports one-click install.</p>
              <button
                onClick={handleInstallClick}
                className="mt-4 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-black hover:bg-emerald-400"
              >
                Install Havenly
              </button>
              <p className="mt-3 text-xs text-slate-400">
                If you don’t see install in Incognito, open a normal browser window.
              </p>
            </>
          ) : (
            <>
              {platformHint === "ios" && isSafariIOS ? (
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
                    <li>Open the browser menu (⋮) or the install icon in the address bar.</li>
                    <li>Select <b>Install Havenly…</b></li>
                  </ol>
                  <p className="mt-3 text-xs text-slate-400">
                    If install never appears, check manifest + service worker and ensure HTTPS.
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
