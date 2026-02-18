"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const IOS_INSTALLED_KEY = "havenly_ios_installed_v1";

function isStandaloneNow(): boolean {
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

function readIOSInstalledFlag(): boolean {
  try {
    return localStorage.getItem(IOS_INSTALLED_KEY) === "1";
  } catch {
    return false;
  }
}

function setIOSInstalledFlag() {
  try {
    localStorage.setItem(IOS_INSTALLED_KEY, "1");
  } catch {}
}

export function useInstallAvailability() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isStandalone, setIsStandalone] = useState(false);
  const [iosInstalledKnown, setIosInstalledKnown] = useState(false);

  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  const isSafariIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (!isIOS) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    // exclude common in-app webviews
    const isWebView = /(fbav|instagram|line|wv)/.test(ua);
    return !isWebView;
  }, [isIOS]);

  // Track standalone state and mark "installed" when we see standalone
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const st = isStandaloneNow();
      setIsStandalone(st);

      // If we ever see standalone on iOS, we can remember the device is installed
      if (st && isIOS) {
        setIOSInstalledFlag();
        setIosInstalledKnown(true);
      } else if (isIOS) {
        setIosInstalledKnown(readIOSInstalledFlag());
      }
    };

    update();

    const queries = [
      "(display-mode: standalone)",
      "(display-mode: minimal-ui)",
      "(display-mode: fullscreen)",
      "(display-mode: window-controls-overlay)",
    ].map((q) => window.matchMedia(q));

    queries.forEach((mq) => {
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
  }, [isIOS]);

  // Capture install prompt event (Chrome/Edge/desktop)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  // Decision:
  // - Always hide install inside installed app (standalone)
  // - Desktop: show only if beforeinstallprompt exists
  // - iOS Safari: show only if NOT installed (known) and not standalone
  const canPromptNative = !isIOS && !!deferredPrompt && !isStandalone;

  const shouldShowInstall =
    !isStandalone &&
    (canPromptNative || (isIOS && isSafariIOS && !iosInstalledKnown));

  return {
    isStandalone,
    isIOS,
    isSafariIOS,
    deferredPrompt,
    canPromptNative,
    iosInstalledKnown,
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
