"use client";

import { useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

type TargetPlan = "TRIAL" | "PREMIUM";

export default function BillingPage() {
  const { session } = useSupabase();
  const { loading, error, planType, credits, renewalDate } = useUserPlan();

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const userEmail = session?.user?.email ?? "Unknown user";

  const readablePlan =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  const planDescription =
    planType === "PREMIUM"
      ? "You have full access to Havenly Premium with deeper insights and supportive reflection tools."
      : planType === "TRIAL"
      ? "You’re in a trial period with access to most Premium features until your renewal date."
      : "You’re currently using the Free plan with core journaling and light reflections.";

  const planLabelColor =
    planType === "PREMIUM"
      ? "bg-emerald-500/10 text-emerald-300"
      : planType === "TRIAL"
      ? "bg-sky-500/10 text-sky-300"
      : "bg-slate-700/40 text-slate-200";

  function formatRenewalLabel() {
    if (!renewalDate) {
      if (planType === "FREE" || planType === null) {
        return "No renewal for Free plan";
      }
      return "Not set";
    }
    try {
      const d = new Date(renewalDate);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return renewalDate;
    }
  }

  async function handleChangePlan(targetPlan: TargetPlan) {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch("/api/user/plan/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: targetPlan }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          (data && (data.error as string)) ||
          "We couldn’t update your plan. Please try again.";
        setActionError(message);
        setActionLoading(false);
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!data?.success) {
        const message =
          (data && (data.error as string)) ||
          "We couldn’t update your plan. Please try again.";
        setActionError(message);
        setActionLoading(false);
        return;
      }

      const successLabel =
        targetPlan === "PREMIUM"
          ? "You’re now on Havenly Premium."
          : "Your trial is now active.";

      setActionSuccess(successLabel);

      // Simple, robust refresh to pick up latest plan/credits
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.reload();
        }, 900);
      }

      setActionLoading(false);
    } catch (err) {
      console.error("Plan change error:", err);
      setActionError(
        "An unexpected error occurred while updating your plan. Please try again."
      );
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-white">
      <h1 className="mb-6 text-3xl font-bold">Billing & Subscription</h1>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        {/* LEFT COLUMN – Current plan + actions */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Your current plan</h2>

          {loading ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-800/60" />
          ) : error ? (
            <p className="text-sm text-red-400">
              We couldn’t load your plan details. You’re currently treated as on
              the Free plan.
            </p>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
                <span className={planLabelColor + " rounded-full px-3 py-1"}>
                  {readablePlan} plan
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-300">{planDescription}</p>

              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-200 sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Account
                  </dt>
                  <dd className="mt-1 break-all text-slate-100">
                    {userEmail}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Credits used / balance
                  </dt>
                  <dd className="mt-1">
                    {typeof credits === "number" ? credits : 0}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Renewal
                  </dt>
                  <dd className="mt-1">{formatRenewalLabel()}</dd>
                </div>
              </dl>

              {/* Status / messages */}
              {actionError && (
                <p className="mt-3 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {actionError}
                </p>
              )}
              {actionSuccess && (
                <p className="mt-3 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  {actionSuccess}
                </p>
              )}

              {/* Actions: vary by plan type */}
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {planType === "PREMIUM" ? (
                  <>
                    <Link
                      href="/premium"
                      className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300"
                    >
                      Open Premium hub
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
                    >
                      Back to dashboard
                    </Link>
                  </>
                ) : planType === "TRIAL" ? (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleChangePlan("PREMIUM")}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading
                        ? "Upgrading..."
                        : "Upgrade to Premium – $25/month"}
                    </button>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
                    >
                      Back to dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleChangePlan("TRIAL")}
                      className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading ? "Starting trial..." : "Start trial"}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleChangePlan("PREMIUM")}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading
                        ? "Upgrading..."
                        : "Upgrade to Premium – $25/month"}
                    </button>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
                    >
                      Back to dashboard
                    </Link>
                  </>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-400">
                In production, this upgrade flow should be triggered only after
                successful payment (e.g., Stripe Checkout or a similar provider)
                and will then call this same endpoint to flip the plan.
              </p>
            </>
          )}
        </section>

        {/* RIGHT COLUMN – Plan comparison / education */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold">Free vs Premium</h2>
          <p className="text-sm text-slate-300">
            Havenly is designed to help you gently keep up with your own life
            story. The Free plan gives you core journaling and light AI
            reflections. Premium opens up deeper patterns, more generous
            monthly usage, and priority access to new tools.
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 text-sm">
            <div className="grid grid-cols-[2fr,1fr,1fr] bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-300">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center text-emerald-300">Premium</span>
            </div>

            <div className="divide-y divide-slate-800 bg-slate-950/60">
              <PlanRow
                feature="Daily private journaling"
                free="Yes"
                premium="Yes"
              />
              <PlanRow
                feature="AI reflections per month"
                free="≈ 20"
                premium="≈ 300"
              />
              <PlanRow
                feature="Deeper pattern insights"
                free="Limited"
                premium="Full access"
              />
              <PlanRow
                feature="Priority access to new tools"
                free="No"
                premium="Yes"
              />
              <PlanRow
                feature="Friendly, judgment-free tone"
                free="Always"
                premium="Always"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400">
            <p>
              Target model: <span className="font-semibold">$25/month</span>{" "}
              with a goal of around{" "}
              <span className="font-semibold">200 active Premium users</span>{" "}
              for a minimum recurring revenue of{" "}
              <span className="font-semibold">$5,000/month</span>. Free users
              experience real value first, and upgrade when they feel consistently
              supported by the tool.
            </p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Credit history & transactions
            </p>
            <p className="mb-3 max-w-lg text-sm text-white/70">
              Review how your credits have been used across reflections and
              tools.
            </p>

            <Link
              href="/settings/transactions"
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              View transaction history →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

interface PlanRowProps {
  feature: string;
  free: string;
  premium: string;
}

function PlanRow({ feature, free, premium }: PlanRowProps) {
  return (
    <div className="grid grid-cols-[2fr,1fr,1fr] px-4 py-2 text-xs text-slate-200">
      <span>{feature}</span>
      <span className="text-center text-slate-300">{free}</span>
      <span className="text-center text-emerald-300">{premium}</span>
    </div>
  );
}
