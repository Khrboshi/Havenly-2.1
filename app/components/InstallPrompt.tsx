"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STATE_KEY = "havenly_install_prompt_v1";
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

function readJSON(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If app is installed → never show
    if (isStandalone()) {
      const prev = readJSON(INSTALLED_KEY) ?? {
        installedAt: Date.now(),
      };
      writeJSON(INSTALLED_KEY, {
        ...prev,
        lastSeenStandaloneAt: Date.now(),
      });
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const state = readJSON(STATE_KEY);

    if (state?.dismissedUntil && Date.now() < state.dismissedUntil) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS has no event — show gentle instruction banner
    if (/iphone|ipad|ipod/.test(ua)) {
      setShow(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

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

  const dismiss = () => {
    writeJSON(STATE_KEY, { dismissedUntil: addDays(SNOOZE_DAYS) });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-200">
          Install Havenly for a faster, full-screen experience.
        </p>

        <div className="flex gap-2">
          {isIOS ? (
            <span className="text-xs text-slate-400">
              Tap Share → Add to Home Screen
            </span>
          ) : (
            <button
              onClick={install}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Install
            </button>
          )}

          <button
            onClick={dismiss}
            className="rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-300 hover:bg-slate-900"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
