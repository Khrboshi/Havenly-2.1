/**
 * app/hooks/useInstallAvailability.ts
 *
 * Detects whether the PWA install prompt is available and manages
 * the beforeinstallprompt lifecycle across browsers.
 *
 * Returns:
 *   isInstalled   — true if already running as a PWA (standalone mode)
 *   isInstallable — true if the browser has a deferred install prompt ready
 *   isIOS         — true if on iOS Safari (which uses a manual Add to Home Screen flow)
 *   promptInstall — call to trigger the native install prompt (non-iOS only)
 *
 * Uses useSyncExternalStore for SSR-safe subscription to the prompt store.
 * iOS standalone detection uses the non-standard navigator.standalone property
 * via a typed interface extension rather than a cast.
 */
"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

// navigator.standalone is a non-standard iOS Safari property not in TypeScript's
// built-in lib.dom.d.ts — declare it here rather than casting to any.
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type StoreState = {
  isStandalone: boolean;
  isIOS: boolean;
  isSafariIOS: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
};

function isStandaloneNow(): boolean {
  if (typeof window === "undefined") return false;

  const navStandalone = (window.navigator as IOSNavigator).standalone === true; // iOS Safari
  const modes = [
    "(display-mode: standalone)",
    "(display-mode: minimal-ui)",
    "(display-mode: fullscreen)",
    "(display-mode: window-controls-overlay)",
  ];
  return navStandalone || modes.some((q) => window.matchMedia(q).matches);
}

function isIOSNow(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isIOSSafariNow(): boolean {
  if (typeof window === "undefined") return false;
  if (!isIOSNow()) return false;

  const ua = window.navigator.userAgent;

  if (/CriOS/i.test(ua) || /FxiOS/i.test(ua)) return false;
  if (/(FBAN|FBAV|Instagram|Line|wv)/i.test(ua)) return false;

  return /Safari/i.test(ua);
}

/**
 * -------- Singleton Store --------
 */
let started = false;
let listeners = new Set<() => void>();

let wantsPreventDefaultCount = 0;
let state: StoreState = {
  isStandalone: false,
  isIOS: false,
  isSafariIOS: false,
  deferredPrompt: null,
};

function emit() {
  for (const l of listeners) l();
}

function computeBaseState(): Pick<StoreState, "isStandalone" | "isIOS" | "isSafariIOS"> {
  return {
    isStandalone: isStandaloneNow(),
    isIOS: isIOSNow(),
    isSafariIOS: isIOSSafariNow(),
  };
}

function startOnce() {
  if (started) return;
  started = true;

  state = { ...state, ...computeBaseState() };
  emit();

  const updateStandalone = () => {
    const base = computeBaseState();
    state = { ...state, ...base };

    // If installed, drop any deferred prompt
    if (base.isStandalone) {
      state = { ...state, deferredPrompt: null };
    }

    emit();
  };

  const queries = [
    "(display-mode: standalone)",
    "(display-mode: minimal-ui)",
    "(display-mode: fullscreen)",
    "(display-mode: window-controls-overlay)",
  ].map((q) => window.matchMedia(q));

  queries.forEach((mq) => {
    if (mq.addEventListener) mq.addEventListener("change", updateStandalone);
    else mq.addListener(updateStandalone);
  });

  const onInstalled = () => updateStandalone();

  const onBIP = (e: Event) => {
    const base = computeBaseState();

    // Ignore iOS (no native prompt) or already installed
    if (base.isStandalone || base.isIOS) return;

    // IMPORTANT:
    // Always store the event so the button can work reliably.
    // Only preventDefault if a UI asked for custom control.
    if (wantsPreventDefaultCount > 0) {
      e.preventDefault();
    }

    state = { ...state, ...base, deferredPrompt: e as BeforeInstallPromptEvent };
    emit();
  };

  window.addEventListener("appinstalled", onInstalled);
  window.addEventListener("beforeinstallprompt", onBIP);

  setTimeout(updateStandalone, 250);
}

function subscribe(cb: () => void) {
  startOnce();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot(): StoreState {
  return { isStandalone: false, isIOS: false, isSafariIOS: false, deferredPrompt: null };
}

/**
 * -------- Public Hook --------
 */
export function useInstallAvailability(opts?: { allowPreventDefault?: boolean }) {
  const allowPreventDefault = opts?.allowPreventDefault ?? false;
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!allowPreventDefault) return;

    wantsPreventDefaultCount += 1;
    return () => {
      wantsPreventDefaultCount = Math.max(0, wantsPreventDefaultCount - 1);
    };
  }, [allowPreventDefault]);

  const canPromptNative = useMemo(() => {
    return !snap.isIOS && !!snap.deferredPrompt && !snap.isStandalone;
  }, [snap.isIOS, snap.deferredPrompt, snap.isStandalone]);

  const shouldShowInstall = useMemo(() => {
    if (snap.isStandalone) return false;
    if (snap.isIOS && snap.isSafariIOS) return true; // manual iOS instructions
    return canPromptNative;
  }, [snap.isStandalone, snap.isIOS, snap.isSafariIOS, canPromptNative]);

  async function promptInstall() {
    if (!snap.deferredPrompt) return { outcome: "dismissed" as const };

    await snap.deferredPrompt.prompt();
    const choice = await snap.deferredPrompt.userChoice;

    // Clear after using (prompt can only be used once)
    state = { ...state, deferredPrompt: null };
    emit();

    return choice;
  }

  return {
    isStandalone: snap.isStandalone,
    isIOS: snap.isIOS,
    isSafariIOS: snap.isSafariIOS,
    deferredPrompt: snap.deferredPrompt,
    canPromptNative,
    shouldShowInstall,
    promptInstall,
  };
}
