export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function BillingPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type, stripe_customer_id")
    .eq("id", session.user.id)
    .maybeSingle();

  const planType = profile?.plan_type ?? "FREE";

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-200">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-white">Billing</h1>
        <p className="mt-2 text-sm text-slate-400">
          Premium checkout is currently disabled while we finish and stabilize the feature.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Current plan</h2>
            <p className="mt-1 text-sm text-slate-300">
              {planType === "PREMIUM" ? "Premium" : "Free"}
              {planType !== "PREMIUM" && (
                <span className="ml-2 text-xs text-slate-500">(Premium coming soon)</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/insights/preview"
              className="rounded-full border border-slate-700 bg-slate-900/50 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              Preview Premium insights
            </Link>

            <Link
              href="/upgrade"
              className="rounded-full bg-emerald-500/70 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400/80"
            >
              Premium (coming soon)
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
            <h3 className="text-sm font-semibold text-white">Why payments are off</h3>
            <p className="mt-2 text-sm text-slate-400">
              We’re finalizing Premium features and reliability before turning on billing,
              so users don’t pay for something still in progress.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
            <h3 className="text-sm font-semibold text-white">What’s coming in Premium</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Deeper reflections</li>
              <li>• Insights & timelines across weeks</li>
              <li>• Weekly and monthly summaries</li>
              <li>• Multi-entry theme detection</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          No pressure. Free remains fully usable.
        </p>
      </div>
    </main>
  );
}
