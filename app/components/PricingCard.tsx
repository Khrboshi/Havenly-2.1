"use client";

import { Check } from "lucide-react";

interface Props {
  title: string;
  price: string;
  items: string[];
  buttonLabel: string;
  disabled?: boolean;
}

export default function PricingCard({
  title,
  price,
  items,
  buttonLabel,
  disabled = false,
}: Props) {
  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-8 flex flex-col justify-between shadow-lg">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-3xl font-bold text-emerald-300 mb-4">{price}</p>

        <ul className="space-y-3 mb-8">
          {items.map((item, i) => (
            <li key={i} className="flex items-center text-slate-300">
              <Check className="h-4 w-4 text-emerald-400 mr-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        disabled={disabled}
        className={`w-full py-3 rounded-xl font-medium transition ${
          disabled
            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
            : "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
