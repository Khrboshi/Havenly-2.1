"use client";

import Link from "next/link";

interface UpgradeTriggerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeTriggerModal({
  open,
  onClose,
}: UpgradeTriggerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-200 shadow-xl">
        <h2 className="text-lg font-semibold">
          You’ve used your free AI reflections
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          The Free plan includes <strong>3 AI reflections per month</strong>.
          You can continue journaling freely, but AI insights pause here.
        </p>

        <p className="mt-3 text-sm text-slate-400">
          Premium unlocks unlimited AI reflections and deeper insights that grow
          with your reflections over time.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/upgrade"
            className="flex-1 rounded-full bg-emerald-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-emerald-300"
          >
            Unlock Premium
          </Link>

          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
