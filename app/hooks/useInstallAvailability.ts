"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

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

  const navStandalone = (window.navigator as any).standalone === true; // iOS Safari
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

  // Exclude Chrome/Firefox on iOS
  if (/CriOS/i.test(ua) || /FxiOS/i.test(ua)) return false;

  // Exclude common in-app webviews
  if (/(FBAN|FBAV|Instagram|Line|wv)/i.test(ua)) return false;

  return /Safari/i.test(ua);
}

/**
 * -------- Singleton Store (listeners register once) --------
 */
let started = false;
let listeners = new Set<() => void>();

let wantsPreventDefaultCount = 0; // # of active consumers requesting preventDefault
let hasCapturedPromptThisSession = false;

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

  // init base flags
  state = { ...state, ...computeBaseState() };
  emit();

  const updateStandalone = () => {
    const base = computeBaseState();
    state = { ...state, ...base };

    if (base.isStandalone) {
      // If installed, drop any deferred prompt
      state = { ...state, deferredPrompt: null };
      hasCapturedPromptThisSession = true;
    }
    emit();
  };

  // watch display mode changes
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

    // Ignore if already installed or iOS (iOS has no native prompt)
    if (base.isStandalone || base.isIOS) return;

    // If no UI wants to control the prompt, do nothing (avoid warnings spam)
    if (wantsPreventDefaultCount <= 0) return;

    // Avoid repeated capture in a session
    if (hasCapturedPromptThisSession) return;
    hasCapturedPromptThisSession = true;

    // Defer prompt so we can trigger it via user gesture
    e.preventDefault();
    state = { ...state, ...base, deferredPrompt: e as BeforeInstallPromptEvent };
    emit();
  };

  window.addEventListener("appinstalled", onInstalled);
  window.addEventListener("beforeinstallprompt", onBIP);

  // refresh once shortly after load
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
 * allowPreventDefault:
 * - true  => consumer wants deferred prompt for a custom Install button
 * - false => consumer does NOT capture (lets Chrome handle it normally)
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
