"use client";

import Link from "next/link";

interface UpgradeNudgeProps {
  credits: number;
  variant?: "default" | "credits";
}

export default function UpgradeNudge({
  credits,
  variant = "default",
}: UpgradeNudgeProps) {
  const message =
    variant === "credits"
      ? "You’ve reached the Free plan limit of 3 AI reflections this month."
      : "Want deeper insights from your reflections?";

  return (
    <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-slate-200">
      <h3 className="text-sm font-semibold">Premium unlocks more clarity</h3>

      <p className="mt-2 text-sm text-slate-400">{message}</p>

      <ul className="mt-3 list-disc pl-5 text-sm text-slate-400">
        <li>Unlimited AI reflections</li>
        <li>Emotional patterns over time</li>
        <li>Calmer, more intentional journaling</li>
      </ul>

      <Link
        href="/upgrade"
        className="mt-4 inline-flex rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
      >
        Explore Premium
      </Link>
    </div>
  );
}
