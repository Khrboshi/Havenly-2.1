import { Sparkles } from "lucide-react";

export default function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-emerald-300 text-xs font-medium bg-emerald-900/40 px-2 py-1 rounded-full border border-emerald-700">
      <Sparkles size={12} />
      Plus
    </span>
  );
}
