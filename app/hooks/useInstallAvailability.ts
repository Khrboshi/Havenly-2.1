"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneNow(): boolean {
  if (typeof window === "undefined") return false;

  const navStandalone = (window.navigator as any).standalone === true;
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
  const isChrome = /CriOS/i.test(ua);
  const isFirefox = /FxiOS/i.test(ua);
  if (isChrome || isFirefox) return false;

  const isWebView = /(FBAN|FBAV|Instagram|Line|wv)/i.test(ua);
  if (isWebView) return false;

  return /Safari/i.test(ua);
}

export function useInstallAvailability(opts?: { allowPreventDefault?: boolean }) {
  const allowPreventDefault = opts?.allowPreventDefault ?? true;

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isStandalone, setIsStandalone] = useState(false);

  // prevents re-handling the same event across route changes
  const seenPromptRef = useRef(false);

  const isIOS = useMemo(() => isIOSNow(), []);
  const isSafariIOS = useMemo(() => isIOSSafariNow(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateStandalone = () => setIsStandalone(isStandaloneNow());

    updateStandalone();

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

    window.addEventListener("appinstalled", updateStandalone);

    return () => {
      queries.forEach((mq) => {
        if (mq.removeEventListener) mq.removeEventListener("change", updateStandalone);
        else mq.removeListener(updateStandalone);
      });
      window.removeEventListener("appinstalled", updateStandalone);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBIP = (e: Event) => {
      // If already installed, ignore.
      if (isStandaloneNow()) return;

      // Avoid spam: only store first prompt per session.
      if (seenPromptRef.current) return;
      seenPromptRef.current = true;

      // Only preventDefault if we actually plan to show a custom install UI.
      // If false, Chrome can show its own UI and no console spam.
      if (allowPreventDefault) {
        e.preventDefault();
      }

      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [allowPreventDefault]);

  const canPromptNative = !isIOS && !!deferredPrompt && !isStandalone;

  const shouldShowInstall =
    !isStandalone &&
    (canPromptNative || (isIOS && isSafariIOS)); // iOS is manual instructions

  return {
    isStandalone,
    isIOS,
    isSafariIOS,
    deferredPrompt,
    canPromptNative,
    shouldShowInstall,
    async promptInstall() {
      if (!deferredPrompt) return { outcome: "dismissed" as const };
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return choice;
    },
  };
}
