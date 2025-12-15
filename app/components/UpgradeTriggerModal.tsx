"use client";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onUpgrade: () => void;
};

export default function UpgradeTriggerModal({
  open,
  title,
  message,
  onClose,
  onUpgrade,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-sm text-white/70">
          {message}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-700 px-4 py-2 text-sm text-white/80 hover:bg-slate-800"
          >
            Not now
          </button>

          <button
            onClick={onUpgrade}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Upgrade to Premium
          </button>
        </div>

        <p className="mt-4 text-xs text-white/40">
          This is a gentle limit to keep Havenly sustainable. Your entries remain private.
        </p>
      </div>
    </div>
  );
}
