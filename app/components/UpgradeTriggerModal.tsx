"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;

  /**
   * Where did the upgrade prompt come from?
   * Examples: "reflection_limit", "premium_page", "dashboard_cta"
   */
  source?: string;

  /**
   * Where should the CTA send users?
   * IMPORTANT: send upgrade intent to a funnel page, not /premium.
   */
  ctaHref?: string;

  /**
   * Optional: override button label
   */
  ctaLabel?: string;
};

async function postUpgradeIntent(payload: Record<string, any>) {
  try {
    await fetch("/api/telemetry/upgrade-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Never block UX on telemetry
  }
}

export default function UpgradeTriggerModal({
  open,
  onClose,
  title,
  message,
  source = "unknown",
  ctaHref = "/upgrade",
  ctaLabel = "Upgrade to Premium",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const viewedOnceRef = useRef(false);
  const [busy, setBusy] = useState(false);

  // Track: modal viewed (once per open)
  useEffect(() => {
    if (!open) {
      viewedOnceRef.current = false;
      setBusy(false);
      return;
    }

    if (!viewedOnceRef.current) {
      viewedOnceRef.current = true;

      postUpgradeIntent({
        event: "upgrade_modal_view",
        source,
        path: pathname,
        ts: new Date().toISOString(),
      });
    }
  }, [open, pathname, source]);

  if (!open) return null;

  async function handleUpgradeClick() {
    if (busy) return;
    setBusy(true);

    await postUpgradeIntent({
      event: "upgrade_modal_click",
      source,
      path: pathname,
      ts: new Date().toISOString(),
    });

    // Close first (prevents UI glitch), then navigate
    onClose();
    router.push(ctaHref);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/90 p-6 text-white shadow-2xl backdrop-blur">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-white/70">{message}</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="w-full rounded-full border border-slate-700 bg-slate-900/40 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-slate-900/70"
          >
            Not now
          </button>

          <button
            onClick={handleUpgradeClick}
            className="w-full rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Opening…" : ctaLabel}
          </button>
        </div>

        <p className="mt-4 text-xs text-white/45">
          This is a gentle limit to keep Havenly sustainable. Your entries remain
          private.
        </p>
      </div>
    </div>
  );
}
