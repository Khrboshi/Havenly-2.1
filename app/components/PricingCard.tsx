"use client";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  items: string[];
  buttonLabel: string;
  disabled?: boolean;
}

export default function PricingCard({
  title,
  price,
  period,
  items,
  buttonLabel,
  disabled,
}: PricingCardProps) {
  return (
    <div className="border border-gray-700 rounded-2xl p-6 bg-[#0F1A24]">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-4xl font-bold mb-1">{price}</p>
      <p className="text-gray-400 mb-6">{period}</p>

      <ul className="space-y-2 mb-6">
        {items.map((i, index) => (
          <li key={index} className="text-gray-300 flex items-start gap-2">
            <span className="text-emerald-400 mt-[2px]">•</span>
            {i}
          </li>
        ))}
      </ul>

      <button
        disabled={disabled}
        className={`w-full py-3 rounded-xl font-medium ${
          disabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
