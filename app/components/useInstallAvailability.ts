"use client";

import { useEffect, useMemo, useState } from "react";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function getIsIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function getIsSafariIOS(isIOS: boolean) {
  if (typeof window === "undefined") return false;
  if (!isIOS) return false;
  const ua = window.navigator.userAgent.toLowerCase();
  // avoid in-app webviews
  const isWebView = /(fbav|instagram|line|wv)/.test(ua);
  return !isWebView;
}

export function useInstallAvailability() {
  const installed = useMemo(() => isStandalone(), []);
  const isIOS = useMemo(() => getIsIOS(), []);
  const isSafariIOS = useMemo(() => getIsSafariIOS(isIOS), [isIOS]);

  const [hasBIP, setHasBIP] = useState(false);

  useEffect(() => {
    if (installed) return;

    const onBIP = (e: Event) => {
      // IMPORTANT: capture it so we can decide UI behavior
      e.preventDefault();
      setHasBIP(true);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, [installed]);

  // Show Install link only if:
  // - not installed AND
  // - desktop supports beforeinstallprompt OR iOS Safari (instructions still useful)
  const showInstall = !installed && (hasBIP || (isIOS && isSafariIOS));

  return { showInstall, installed, hasBIP, isIOS, isSafariIOS };
}
