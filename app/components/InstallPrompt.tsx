// app/components/InstallPrompt.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STATE_KEY = "havenly_install_prompt_v2";
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

function useIsIOS() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);
}

function ShareIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M12 3v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M8 12h8M12 8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
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
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Never show in standalone (installed)
    if (isStandalone()) {
      const prev = readJSON(INSTALLED_KEY) ?? { installedAt: Date.now() };
      writeJSON(INSTALLED_KEY, {
        ...prev,
        lastSeenStandaloneAt: Date.now(),
      });
      return;
    }

    const state = readJSON<{ dismissedUntil?: number }>(STATE_KEY);
    if (state?.dismissedUntil && Date.now() < state.dismissedUntil) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS has no beforeinstallprompt — show our nice instructions card anyway
    if (isIOS) setShow(true);

    // If user *does* install, hide future prompts
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
  }, [isIOS]);

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

  // On non-iOS: only show if we actually have the event (prevents showing to ineligible browsers)
  if (!show) return null;
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-xl">
        <div
          className={[
            "relative overflow-hidden rounded-3xl border border-slate-800/80",
            "bg-slate-950/80 backdrop-blur-xl shadow-2xl",
          ].join(" ")}
        >
          {/* soft glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-48 w-72 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <SparkleIcon className="h-5 w-5 text-emerald-200" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Install Havenly
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Get a faster, full-screen journaling experience—like a native
                  app. Works offline for your last opened screens.
                </p>
              </div>

              <button
                onClick={dismiss}
                aria-label="Dismiss install prompt"
                className="rounded-full border border-slate-700/70 bg-slate-950/40 px-3 py-1 text-xs text-slate-300 hover:bg-slate-900/60"
              >
                Not now
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {/* left: benefits */}
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
                <p className="text-xs font-semibold text-slate-200">
                  What you get
                </p>
                <ul className="mt-2 space-y-2 text-xs text-slate-300">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                    One-tap launch from your home screen
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                    Full-screen, distraction-free experience
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                    Better feel + quicker loads
                  </li>
                </ul>
              </div>

              {/* right: install actions */}
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
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
                      Tip: If you don’t see “Add to Home Screen”, scroll the
                      share sheet.
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={install}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                    >
                      Install
                    </button>
                    <button
                      onClick={dismiss}
                      className="inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/60"
                    >
                      Later
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-[0.72rem] text-slate-500">
              This prompt won’t show inside the installed app. If you dismiss it,
              we’ll remind you again in {SNOOZE_DAYS} days.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
