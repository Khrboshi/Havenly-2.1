"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/components/telemetry";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STATE_KEY = "havenly_install_state_v1";

/**
 * Behavior:
 * - Standalone (already installed): show nothing
 * - iOS Safari (not installed): show a lightweight banner explaining Add to Home Screen
 * - Android/desktop Chrome (not installed): use beforeinstallprompt + show a banner/button when available
 * - Gated by a small engagement threshold to avoid spam
 */
const MIN_SECONDS_ON_SITE = 15;
const MIN_PAGE_VIEWS = 2;
const SNOOZE_DAYS = 5;

type PromptState = {
  firstSeenAt?: number;
  pageViews?: number;
  totalSeconds?: number;
  lastTickAt?: number;
  dismissedUntil?: number;
};

function readJSON<T>(key: string): T | null {
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

function isIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function isSafariIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  if (!/iphone|ipad|ipod/.test(ua)) return false;
  // Avoid in-app webviews where Add to Home Screen may be limited
  const isWebView = /(fbav|instagram|line|wv)/.test(ua);
  return !isWebView;
}

function shouldNeverPromptOnPath(path: string) {
  return (
    path.startsWith("/auth") ||
    path.startsWith("/magic-login") ||
    path.startsWith("/logout")
  );
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

  const ios = useMemo(() => isIOS(), []);
  const safariIOS = useMemo(() => isSafariIOS(), []);
  const [mounted, setMounted] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => setMounted(true), []);

  // Engagement tracking (page views + time)
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    if (isStandalone()) {
      setShow(false);
      return;
    }

    const state = (readJSON<PromptState>(STATE_KEY) ?? {}) as PromptState;
    state.firstSeenAt = state.firstSeenAt ?? Date.now();
    state.pageViews = (state.pageViews ?? 0) + 1;
    state.lastTickAt = state.lastTickAt ?? Date.now();
    writeJSON(STATE_KEY, state);

    const interval = window.setInterval(() => {
      const s = (readJSON<PromptState>(STATE_KEY) ?? {}) as PromptState;
      const now = Date.now();
      const last = s.lastTickAt ?? now;
      const deltaSec = Math.max(0, Math.round((now - last) / 1000));
      s.totalSeconds = (s.totalSeconds ?? 0) + deltaSec;
      s.lastTickAt = now;
      writeJSON(STATE_KEY, s);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [mounted, pathname]);

  // Capture beforeinstallprompt (Chrome/Edge/Android mostly)
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    if (shouldNeverPromptOnPath(pathname) || isStandalone()) {
      setShow(false);
      return;
    }

    const onBIP = (e: Event) => {
      // Chrome fires this only when installable
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      track("beforeinstallprompt_fired", { pathname });
    };

    const onInstalled = () => {
      track("appinstalled", { pathname });
      setDeferredPrompt(null);
      setShow(false);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [mounted, pathname]);

  // Decide whether to show
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    if (shouldNeverPromptOnPath(pathname) || isStandalone()) {
      setShow(false);
      return;
    }

    const state = (readJSON<PromptState>(STATE_KEY) ?? {}) as PromptState;

    // snooze gate
    if (state.dismissedUntil && Date.now() < state.dismissedUntil) {
      setShow(false);
      return;
    }

    const pv = state.pageViews ?? 0;
    const sec = state.totalSeconds ?? 0;
    const engaged = pv >= MIN_PAGE_VIEWS || sec >= MIN_SECONDS_ON_SITE;
    if (!engaged) {
      setShow(false);
      return;
    }

    // Eligibility:
    // - iOS Safari: show banner (manual Add to Home Screen)
    // - Others: show only if we have beforeinstallprompt (native prompt available)
    const eligibleIOS = ios && safariIOS;
    const eligibleOther = !ios && !!deferredPrompt;

    setShow(eligibleIOS || eligibleOther);
  }, [mounted, pathname, ios, safariIOS, deferredPrompt]);

  const dismiss = (reason: "close" | "later" = "close") => {
    track("install_prompt_dismissed", { reason, pathname });

    const s = (readJSON<PromptState>(STATE_KEY) ?? {}) as PromptState;
    s.dismissedUntil = addDays(SNOOZE_DAYS);
    writeJSON(STATE_KEY, s);

    setShow(false);
  };

  const installNative = async () => {
    if (!deferredPrompt) return;
    track("install_prompt_clicked_install", { pathname });

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      track("install_prompt_outcome", { pathname, outcome: "accepted" });
      setShow(false);
      setDeferredPrompt(null);
      return;
    }

    track("install_prompt_outcome", { pathname, outcome: "dismissed" });
    dismiss("later");
  };

  if (!mounted) return null;
  if (!show) return null;

  // iOS but not Safari (webview): do not show to avoid confusion
  if (ios && !safariIOS) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">Install Havenly</p>
            {ios ? (
              <p className="mt-1 text-xs text-slate-300">
                In Safari, tap <span className="inline-flex items-center gap-1 font-semibold text-slate-100"><ShareIcon className="h-4 w-4" /> Share</span>{" "}
                then <span className="inline-flex items-center gap-1 font-semibold text-slate-100"><PlusSquareIcon className="h-4 w-4" /> Add to Home Screen</span>.
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

        {!ios && deferredPrompt ? (
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
