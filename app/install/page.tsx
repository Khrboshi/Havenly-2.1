"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const ua = useMemo(() => {
    if (typeof navigator === "undefined") return "";
    return navigator.userAgent || "";
  }, []);

  const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(ua), [ua]);
  const isAndroid = useMemo(() => /Android/.test(ua), [ua]);
  const isSafari = useMemo(
    () => /^((?!chrome|android).)*safari/i.test(ua),
    [ua]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <main style={{ minHeight: "100vh", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Install Havenly</h1>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        Installing creates an app icon and improves the login experience from email links.
      </p>

      {isAndroid && (
        <section style={{ padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Android (Chrome)</h2>
          {deferredPrompt ? (
            <button
              onClick={onInstallClick}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
              }}
            >
              Install Havenly
            </button>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
              <li>Open this site in Chrome.</li>
              <li>Tap the menu (⋮).</li>
              <li>Select <b>Install app</b> or <b>Add to Home screen</b>.</li>
            </ol>
          )}
        </section>
      )}

      {isIOS && (
        <section style={{ padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>iPhone / iPad</h2>
          {!isSafari ? (
            <p style={{ opacity: 0.9, margin: 0 }}>
              On iOS, install works best in <b>Safari</b>. Please open this page in Safari.
            </p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
              <li>Tap the <b>Share</b> icon.</li>
              <li>Select <b>Add to Home Screen</b>.</li>
              <li>Tap <b>Add</b>.</li>
            </ol>
          )}
          <p style={{ opacity: 0.75, marginTop: 10 }}>
            Note: iOS PWAs can’t always open directly from email like native apps, but install still improves the experience.
          </p>
        </section>
      )}

      {!isAndroid && !isIOS && (
        <section style={{ padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Desktop</h2>
          <ol style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
            <li>Open this site in Chrome or Edge.</li>
            <li>Click the install icon in the address bar (if shown), or open the browser menu.</li>
            <li>Select <b>Install Havenly</b>.</li>
          </ol>
        </section>
      )}
    </main>
  );
}
