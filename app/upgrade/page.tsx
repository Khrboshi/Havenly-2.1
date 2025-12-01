"use client";

import { useState } from "react";
import PricingCard from "@/app/components/PricingCard";
import { PlanType, useUserPlan } from "@/app/components/useUserPlan";

export default function UpgradePage() {
  const { planType, loading, refresh } = useUserPlan();
  const [updating, setUpdating] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChangePlan = async (targetPlan: PlanType) => {
    try {
      setError(null);
      setUpdating(targetPlan);

      const res = await fetch("/api/user/plan/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: targetPlan }),
      });

      if (res.status === 401) {
        // Not authenticated – send to magic login preserving intent
        window.location.href = "/magic-login?from=upgrade";
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(
          data?.error ||
            "We couldn’t update your plan right now. Please try again."
        );
      } else {
        await refresh();
      }
    } catch (err) {
      console.error("Error updating plan:", err);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setUpdating(null);
    }
  };

  const isFree = planType === "FREE";
  const isEssential = planType === "ESSENTIAL";
  const isPremium = planType === "PREMIUM";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-20 px-6">
      <div className="mx-auto mb-14 max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-semibold text-white">
          Choose your Havenly plan
        </h1>
        <p className="text-lg text-slate-300">
          Start free, add Essential for structure and gentle AI, or unlock
          everything with Premium. Credits let you go deeper whenever you need.
        </p>
        {error && (
          <p className="mt-4 text-sm text-rose-300">
            {error}
          </p>
        )}
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {/* FREE PLAN */}
        <PricingCard
          title="Free"
          price="$0 / forever"
          items={[
            "Daily journaling",
            "Breathing tools",
            "Guided check-in prompts",
            "Local-only storage",
          ]}
          buttonLabel={isFree ? "Current plan" : "Stay on Free"}
          disabled={isFree || loading}
        />

        {/* ESSENTIAL PLAN */}
        <PricingCard
          title="Essential"
          price="$4 / month"
          items={[
            "Everything in Free",
            "AI journal summaries (light)",
            "Habit & goal tracking",
            "Basic insights & patterns",
          ]}
          buttonLabel={isEssential ? "Current plan" : "Upgrade to Essential"}
          disabled={loading}
          highlight={!isPremium && !isFree}
          loading={updating === "ESSENTIAL"}
          onClick={() => handleChangePlan("ESSENTIAL")}
        />

        {/* PREMIUM PLAN */}
        <PricingCard
          title="Premium"
          price="$9 / month"
          items={[
            "Everything in Essential",
            "Deep AI reflections",
            "Weekly wellness reports",
            "Personalised roadmap",
            "Best value for frequent users",
          ]}
          buttonLabel={isPremium ? "Current plan" : "Upgrade to Premium"}
          disabled={loading}
          highlight={isPremium}
          loading={updating === "PREMIUM"}
          onClick={() => handleChangePlan("PREMIUM")}
        />
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-400">
        Credits for deep-dive sessions will be available as an add-on so you
        can access occasional intensive AI support without changing your main
        plan.
      </p>
    </div>
  );
}
