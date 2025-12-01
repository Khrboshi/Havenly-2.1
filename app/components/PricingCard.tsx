"use client";

import { Check } from "lucide-react";

interface Props {
  title: string;
  price: string;
  items: string[];
  buttonLabel: string;
  disabled?: boolean;
  highlight?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

export default function PricingCard({
  title,
  price,
  items,
  buttonLabel,
  disabled = false,
  highlight = false,
  onClick,
  loading = false,
}: Props) {
  const effectiveDisabled = disabled || loading;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-slate-900/70 p-6 text-left shadow-sm shadow-black/40 ${
        highlight
          ? "border-emerald-400/80 ring-2 ring-emerald-500/50"
          : "border-slate-700/70"
      }`}
    >
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-2xl font-bold text-emerald-300">{price}</p>
      </header>

      <ul className="mb-6 space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={effectiveDisabled}
        onClick={effectiveDisabled ? undefined : onClick}
        className={`mt-auto w-full rounded-xl py-3 text-sm font-medium transition ${
          effectiveDisabled
            ? "cursor-not-allowed bg-slate-700 text-slate-400"
            : highlight
            ? "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
            : "bg-slate-100 text-slate-900 hover:bg-slate-50"
        }`}
      >
        {loading ? "Please wait..." : buttonLabel}
      </button>
    </article>
  );
}
