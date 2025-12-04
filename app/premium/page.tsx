// app/premium/page.tsx
"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function PremiumPage() {
  const { credits, renewalDate, planType } = useUserPlan();

  return (
    <RequirePremium>
      <div className="min-h-screen px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-4">Havenly Premium</h1>

        <p className="text-white/70 max-w-xl mb-8">
          Thank you for being a Premium member. You now have full access to all
          advanced insights, tools, and improved journaling experiences.
        </p>

        <div className="rounded-xl border border-white/10 p-6 bg-slate-900/50 backdrop-blur max-w-md">
          <p className="mb-2">
            <strong>Plan:</strong> {planType}
          </p>
          <p className="mb-2">
            <strong>Credits:</strong> {credits ?? 0}
          </p>
          <p className="mb-6">
            <strong>Renewal:</strong> {renewalDate || "N/A"}
          </p>

          <Link
            href="/settings/billing"
            className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400"
          >
            Manage Subscription
          </Link>
        </div>
      </div>
    </RequirePremium>
  );
}
