"use client";

import { useMemo } from "react";
import { useInstallAvailability } from "@/app/hooks/useInstallAvailability";

export default function InstallPage() {
  // Instruction page only. Banner owns preventDefault and native prompt.
  const { isStandalone, isIOS, isSafariIOS } = useInstallAvailability({ allowPreventDefault: false });

  const platformHint = useMemo(() => (isIOS ? "ios" : "other"), [isIOS]);

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
            Havenly is already installed on this device. The Install banner/tab should be hidden in
            standalone mode.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Install on this device</h2>

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
                <li>
                  Click the install icon in the address bar (if shown) <b>or</b> open the browser
                  menu (⋮).
                </li>
                <li>
                  Select <b>Install Havenly…</b>
                </li>
              </ol>
              <p className="mt-3 text-xs text-slate-400">
                If install never appears, the app may already be installed or the browser isn’t
                detecting installability.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
