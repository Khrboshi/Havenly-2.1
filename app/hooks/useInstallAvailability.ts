"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type StoreState = {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  isIOS: boolean;
  isSafariIOS: boolean;
};

function detectIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/**
 * True iOS Safari (not Chrome iOS, not Firefox iOS, not in-app webviews).
 * - Chrome iOS uses "CriOS"
 * - Firefox iOS uses "FxiOS"
 * - In-app webviews often include FBAV / Instagram / Line / wv etc.
 */
function detectIOSSafari(): boolean {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const isIOSDevice = /iPhone|iPad|iPod/i.test(ua);
  if (!isIOSDevice) return false;

  const isChrome = /CriOS/i.test(ua);
  const isFirefox = /FxiOS/i.test(ua);
  if (isChrome || isFirefox) return false;

  const isWebView = /(FBAN|FBAV|Instagram|Line|wv)/i.test(ua);
  if (isWebView) return false;

  return /Safari/i.test(ua);
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;

  const navStandalone = (window.navigator as any).standalone === true; // iOS Safari
  const modes = [
    "(display-mode: standalone)",
    "(display-mode: minimal-ui)",
    "(display-mode: fullscreen)",
    "(display-mode: window-controls-overlay)",
  ];
  const mediaStandalone = modes.some((q) => window.matchMedia(q).matches);

  return navStandalone || mediaStandalone;
}

// --------------------
// Singleton store
// --------------------
let started = false;
let state: StoreState = {
  deferredPrompt: null,
  isStandalone: false,
  isIOS: false,
  isSafariIOS: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setState(patch: Partial<StoreState>) {
  state = { ...state, ...patch };
  emit();
}

function startStore() {
  if (started || typeof window === "undefined") return;
  started = true;

  // initial detection
  setState({
    isIOS: detectIOS(),
    isSafariIOS: detectIOSSafari(),
    isStandalone: detectStandalone(),
  });

  // track standalone changes
  const mqs = [
    "(display-mode: standalone)",
    "(display-mode: minimal-ui)",
    "(display-mode: fullscreen)",
    "(display-mode: window-controls-overlay)",
  ].map((q) => window.matchMedia(q));

  const onModeChange = () => {
    setState({ isStandalone: detectStandalone() });
  };

  mqs.forEach((mq) => {
    if (mq.addEventListener) mq.addEventListener("change", onModeChange);
    else mq.addListener(onModeChange);
  });

  // capture install prompt ONCE
  const onBIP = (e: Event) => {
    // Prevent Chrome mini-infobar; we will trigger prompt() ourselves.
    e.preventDefault();
    setState({ deferredPrompt: e as BeforeInstallPromptEvent });
  };

  const onInstalled = () => {
    setState({ deferredPrompt: null, isStandalone: true });
  };

  window.addEventListener("beforeinstallprompt", onBIP);
  window.addEventListener("appinstalled", onInstalled);

  // Also update standalone on install event
  window.addEventListener("appinstalled", onModeChange);

  // No teardown needed for singleton in app lifetime.
}

function subscribe(cb: () => void) {
  startStore();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot(): StoreState {
  return {
    deferredPrompt: null,
    isStandalone: false,
    isIOS: false,
    isSafariIOS: false,
  };
}

export function useInstallAvailability() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const canPromptNative = useMemo(() => {
    return !snap.isIOS && !!snap.deferredPrompt && !snap.isStandalone;
  }, [snap.isIOS, snap.deferredPrompt, snap.isStandalone]);

  const shouldShowInstall = useMemo(() => {
    if (snap.isStandalone) return false;
    // iOS Safari cannot fire beforeinstallprompt; install UI should be manual instructions.
    return canPromptNative || (snap.isIOS && snap.isSafariIOS);
  }, [snap.isStandalone, snap.isIOS, snap.isSafariIOS, canPromptNative]);

  async function promptInstall() {
    if (!state.deferredPrompt) return { outcome: "dismissed" as const };

    await state.deferredPrompt.prompt();
    const choice = await state.deferredPrompt.userChoice;

    // The event can only be used once.
    setState({ deferredPrompt: null });

    return choice;
  }

  return {
    ...snap,
    canPromptNative,
    shouldShowInstall,
    promptInstall,
  };
}
