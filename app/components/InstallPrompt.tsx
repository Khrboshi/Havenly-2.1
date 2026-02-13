// app/components/InstallPrompt.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STATE_KEY = "havenly_install_prompt_v3"; // bump version if you change behavior/UI
const INSTALLED_KEY = "havenly_installed_v1";
const SNOOZE_DAYS = 5;

function addDays(days: number) {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function readJSON<T = any>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function useIsIOS() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);
}

function useIsSafariIOS(isIOS: boolean) {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    if (!isIOS) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // iOS browsers are Safari underneath; this tries to avoid showing on in-app webviews
    const isWebView = /(fbav|instagram|line|wv)/.test(ua);
    return !isWebView;
  }, [isIOS]);
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

function SparkleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={props.className}>
      <path
        d="M12 2l1.2 4.2L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.8 2.7L22.5 16l-2.7.8L19 19.5l-.8-2.7L15.5 16l2.7-1.3L19 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 13l.7 2.2L7.5 16l-2.3.7L4.5 19l-.7-2.3L1.5 16l2.3-.8L4.5 13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InstallPrompt() {
  const isIOS = useIsIOS();
  const isSafariIOS = useIsSafariIOS(isIOS);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const installedState = readJSON<{ installedAt?: number; lastSeenStandaloneAt?: number }>(
      INSTALLED_KEY
    );

    // If currently running as installed app: record + never show prompt.
    if (isStandalone()) {
      writeJSON(INSTALLED_KEY, {
        installedAt: installedState?.installedAt ?? Date.now(),
        lastSeenStandaloneAt: Date.now(),
      });
      setShow(false);
      setDeferredPrompt(null);
      return;
    }

    // If we *previously* saw the app installed, but now we're not standalone anymore,
    // user likely uninstalled => allow prompting again by clearing snooze state.
    if (installedState?.installedAt) {
      removeKey(INSTALLED_KEY);
      removeKey(STATE_KEY);
    }

    const state = readJSON<{ dismissedUntil?: number }>(STATE_KEY);
    if (state?.dismissedUntil && Date.now() < state.dismissedUntil) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS: no beforeinstallprompt. Only show for Safari iOS (avoid in-app webviews).
    if (isSafariIOS) setShow(true);

    const onInstalled = () => {
      writeJSON(INSTALLED_KEY, {
        installedAt: Date.now(),
        lastSeenStandaloneAt: Date.now(),
      });
      setShow(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isSafariIOS]);

  const dismiss = () => {
    writeJSON(STATE_KEY, { dismissedUntil: addDays(SNOOZE_DAYS) });
    setShow(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    setShow(false);
    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      writeJSON(INSTALLED_KEY, {
        installedAt: Date.now(),
        lastSeenStandaloneAt: Date.now(),
      });
      return;
    }

    writeJSON(STATE_KEY, { dismissedUntil: addDays(SNOOZE_DAYS) });
  };

  // Non-iOS: only show if we actually have the event (prevents showing to ineligible browsers)
  if (!mounted) return null;
  if (!show) return null;
  if (!isIOS && !deferredPrompt) return null;
  if (isIOS && !isSafariIOS) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      {/* overlay */}
      <button
        aria-label="Close install prompt overlay"
        onClick={dismiss}
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
      />

      {/* card */}
      <div
        className={[
          "relative w-full max-w-xl overflow-hidden rounded-3xl",
          "border border-slate-700/70 bg-slate-950/90 shadow-2xl",
          "transition duration-200 ease-out",
          "animate-in fade-in slide-in-from-bottom-2",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* top brand strip */}
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400/70 via-cyan-400/40 to-transparent" />

        {/* soft glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-8 h-56 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <SparkleIcon className="h-5 w-5 text-emerald-200" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Install Havenly</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Faster, full-screen journaling—like a native app. Keeps your last opened screens available
                even when you’re offline.
              </p>
            </div>

            <button
              onClick={dismiss}
              className={[
                "rounded-full border border-slate-700/60 bg-slate-900/30",
                "px-3 py-1 text-xs text-slate-200 hover:bg-slate-900/60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40",
              ].join(" ")}
            >
              Not now
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {/* benefits */}
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/35 p-4">
              <p className="text-xs font-semibold text-slate-200">What you get</p>
              <ul className="mt-2 space-y-2 text-xs text-slate-300">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                  One-tap launch from your home screen
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                  Full-screen, distraction-free experience
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                  Better feel + quicker loads
                </li>
              </ul>
            </div>

            {/* actions / iOS instructions */}
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/35 p-4">
              <p className="text-xs font-semibold text-slate-200">
                {isIOS ? "Install on iPhone/iPad" : "Install in one tap"}
              </p>

              {isIOS ? (
                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShareIcon className="h-4 w-4 text-slate-200" />
                    <span>Tap the Share button in Safari</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlusSquareIcon className="h-4 w-4 text-slate-200" />
                    <span>Select “Add to Home Screen”</span>
                  </div>
                  <div className="pt-2 text-[0.72rem] text-slate-400">
                    Tip: If you don’t see it, scroll the share sheet.
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={install}
                    className={[
                      "inline-flex flex-1 items-center justify-center rounded-full",
                      "bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950",
                      "hover:bg-emerald-300",
                      "shadow-[0_0_0_1px_rgba(16,185,129,.25),0_10px_30px_rgba(16,185,129,.15)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60",
                    ].join(" ")}
                  >
                    Install
                  </button>

                  <button
                    onClick={dismiss}
                    className={[
                      "inline-flex items-center justify-center rounded-full",
                      "border border-slate-700/60 bg-slate-900/30 px-4 py-2",
                      "text-sm font-semibold text-slate-200 hover:bg-slate-900/60",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40",
                    ].join(" ")}
                  >
                    Later
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-[0.72rem] text-slate-400">
            This won’t show inside the installed app. If you dismiss, we’ll remind you again in{" "}
            {SNOOZE_DAYS} days.
          </div>
        </div>
      </div>
    </div>
  );
}
