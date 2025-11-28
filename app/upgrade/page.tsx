"use client";

import PricingCard from "@/app/components/PricingCard";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h1 className="text-4xl font-semibold text-white mb-4">
          Choose Your Havenly Plan
        </h1>
        <p className="text-slate-300 text-lg">
          Start with the free plan or unlock deeper insights with Havenly Premium.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* FREE PLAN */}
        <PricingCard
          title="Free Plan"
          price="$0 / forever"
          items={[
            "Daily journaling",
            "Local-only storage",
            "1 active journal",
            "Basic insights"
          ]}
          buttonLabel="Current Plan"
          disabled={true}
        />

        {/* PREMIUM PLAN */}
        <PricingCard
          title="Premium"
          price="$5 / month"
          items={[
            "Unlimited Journals",
            "AI-guided journaling",
            "Deep emotional insights",
            "Sentiment trends & analytics",
            "Advanced privacy & syncing",
            "Priority feature access"
          ]}
          buttonLabel="Coming Soon"
          disabled={true}
        />
      </div>

      <p className="text-center text-slate-400 text-sm mt-10">
        Annual plan ($49/year) coming soon.
      </p>
    </div>
  );
}
