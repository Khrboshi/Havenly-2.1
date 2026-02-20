"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useInstallAvailability } from "@/app/hooks/useInstallAvailability";
import { track } from "@/components/telemetry";

function shouldNeverPromptOnPath(path: string) {
  return path.startsWith("/auth") || path.startsWith("/magic-login") || path.startsWith("/logout");
}

function ShareIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={props.className}>
      <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M8.5 6.5 12 3l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.5H6a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusSquareIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={props.className}>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function InstallPrompt() {
  const pathname = usePathname();

  // The banner is the ONLY place that requests preventDefault (custom install UI).
  const { isIOS, isSafariIOS, canPromptNative, shouldShowInstall, promptInstall } =
    useInstallAvailability({ allowPreventDefault: true });

  const [hidden, setHidden] = useState(false);

  const blockedPath = useMemo(() => shouldNeverPromptOnPath(pathname), [pathname]);

  const show = useMemo(() => {
    if (hidden) return false;
    if (blockedPath) return false;
    return shouldShowInstall;
  }, [hidden, blockedPath, shouldShowInstall]);

  const dismiss = (reason: "close" | "later" = "close") => {
    track("install_prompt_dismissed", { reason, pathname });
    setHidden(true);
  };

  const installNative = async () => {
    track("install_prompt_clicked_install", { pathname });
    const choice = await promptInstall();
    track("install_prompt_outcome", { pathname, outcome: choice.outcome });
    if (choice.outcome === "accepted") setHidden(true);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">Install Havenly</p>

            {isIOS && isSafariIOS ? (
              <p className="mt-1 text-xs text-slate-300">
                On iPhone Safari: tap{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-slate-100">
                  <ShareIcon className="h-4 w-4" /> Share
                </span>{" "}
                then{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-slate-100">
                  <PlusSquareIcon className="h-4 w-4" /> Add to Home Screen
                </span>
                .
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-300">
                Get a faster, app-like experience with offline support.
              </p>
            )}
          </div>

          <button
            onClick={() => dismiss("close")}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        {canPromptNative ? (
          <div className="mt-3 flex gap-2">
            <button
              onClick={installNative}
              className="flex-1 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Install
            </button>
            <button
              onClick={() => dismiss("later")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Later
            </button>
          </div>
        ) : (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => dismiss("later")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Got it
            </button>
          </div>
        )}

        <p className="mt-2 text-[11px] text-slate-400">
          This won’t appear when Havenly is opened as an installed app.
        </p>
      </div>
    </div>
  );
}
