"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function readStandaloneNow(): boolean {
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

export function useInstallAvailability() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isStandalone, setIsStandalone] = useState(false);

  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  const isSafariIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (!isIOS) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    const isWebView = /(fbav|instagram|line|wv)/.test(ua);
    return !isWebView;
  }, [isIOS]);

  // keep standalone state reactive
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setIsStandalone(readStandaloneNow());
    update();

    const queries = [
      "(display-mode: standalone)",
      "(display-mode: minimal-ui)",
      "(display-mode: fullscreen)",
      "(display-mode: window-controls-overlay)",
    ].map((q) => window.matchMedia(q));

    queries.forEach((mq) => {
      // older safari support
      if (mq.addEventListener) mq.addEventListener("change", update);
      else mq.addListener(update);
    });

    window.addEventListener("appinstalled", update);

    return () => {
      queries.forEach((mq) => {
        if (mq.removeEventListener) mq.removeEventListener("change", update);
        else mq.removeListener(update);
      });
      window.removeEventListener("appinstalled", update);
    };
  }, []);

  // capture BIP event (desktop only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const canPromptNative = !isIOS && !!deferredPrompt && !isStandalone;
  const shouldShowInstall = !isStandalone && (canPromptNative || (isIOS && isSafariIOS));

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
