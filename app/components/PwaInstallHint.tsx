"use client";

import { useEffect, useState } from "react";

export default function PwaInstallHint() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  // Detect mobile
  const isMobile =
    typeof window !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isMobile) return;

    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
      setVisible(true); // Only show when PWA is installable
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isMobile]);

  if (!visible || !promptEvent) return null;

  const install = async () => {
    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
  };

  return (
    <div
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 
        w-[92%] max-w-sm 
        bg-white text-slate-900 
        shadow-lg rounded-xl px-4 py-3 
        flex items-center justify-between gap-3
        animate-fade-in 
        z-50
      "
    >
      <div className="flex-1">
        <p className="text-sm font-semibold">Install Havenly</p>
        <p className="text-xs text-slate-500">
          Add Havenly Journal to your home screen for faster access.
        </p>
      </div>

      <button
        onClick={install}
        className="
          bg-emerald-600 hover:bg-emerald-700 
          text-white text-xs font-medium 
          px-3 py-2 rounded-md transition
        "
      >
        Install
      </button>

      <button
        onClick={() => setVisible(false)}
        className="text-slate-400 text-xs px-2"
      >
        ✕
      </button>
    </div>
  );
}
