"use client";

import Link from "next/link";
import { useState } from "react";
import PricingCard from "@/app/components/PricingCard";

export default function UpgradePage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen px-6 md:px-10 py-16 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-4">Upgrade to Havenly Premium</h1>
      <p className="text-gray-300 max-w-2xl mb-10">
        Unlock deeper weekly insights, emotional patterns, cloud backup,
        and clarity reports. Your writing always stays private.
      </p>

      {/* Billing Selection */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-4 py-2 rounded-lg border ${
            billing === "monthly"
              ? "bg-emerald-700 border-emerald-500"
              : "border-gray-600"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`px-4 py-2 rounded-lg border ${
            billing === "yearly"
              ? "bg-emerald-700 border-emerald-500"
              : "border-gray-600"
          }`}
        >
          Yearly (Save 18%)
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <PricingCard
          title="Free Plan"
          price="$0"
          period="forever"
          items={[
            "Daily journaling",
            "Local-only storage",
            "Basic text editor",
            "Private — no ads, no feed",
          ]}
          buttonLabel="Current Plan"
          disabled
        />

        <PricingCard
          title="Premium"
          price={billing === "monthly" ? "$5" : "$49"}
          period={billing === "monthly" ? "per month" : "per year"}
          items={[
            "Weekly AI summaries",
            "Emotion pattern insights",
            "Deep clarity reports",
            "Cloud backup (end-to-end encrypted)",
            "Priority feature access",
          ]}
          buttonLabel="Coming Soon"
          disabled
        />
      </div>

      <p className="text-gray-400 text-sm mt-10">
        Payments are not yet enabled — premium is coming soon.
      </p>

      <Link
        href="/dashboard"
        className="inline-block mt-6 text-emerald-400 underline"
      >
        Return to dashboard →
      </Link>
    </div>
  );
}
