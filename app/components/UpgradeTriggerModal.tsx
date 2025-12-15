"use client";

import Link from "next/link";

export default function UpgradeTriggerModal({
  open,
  onClose,
  title = "You’ve used your reflections for now",
  message = "Upgrade to Premium for unlimited reflections and deeper insights.",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-white/70">{message}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-900"
          >
            Not now
          </button>

          <Link
            href="/premium"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Upgrade to Premium
          </Link>
        </div>

        <p className="mt-4 text-xs text-white/50">
          This is a gentle limit to keep Havenly sustainable. Your entries remain private.
        </p>
      </div>
    </div>
  );
}
