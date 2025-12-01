import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

type PlanType = "FREE" | "ESSENTIAL" | "PREMIUM";

function getPlanLabel(planType: PlanType): string {
  if (planType === "PREMIUM") return "Premium";
  if (planType === "ESSENTIAL") return "Essential";
  return "Free";
}

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only authenticated users can see this page
  if (!session?.user) {
    redirect("/magic-login?from=premium");
  }

  const user = session.user;

  let planType: PlanType = "FREE";
  let credits = 0;
  let renewalDate: string | null = null;

  try {
    const { data: planRow, error } = await supabase
      .from("user_plans")
      .select("plan_type, credits_balance, renewal_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && planRow) {
      planType = (planRow.plan_type as PlanType) || "FREE";
      credits = planRow.credits_balance ?? 0;
      renewalDate = planRow.renewal_date ?? null;
    }
  } catch (err) {
    console.error("Error loading plan in PremiumPage:", err);
  }

  const isPremium = planType === "PREMIUM";
  const planLabel = getPlanLabel(planType);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-4xl px-4 pt-28 pb-20">
        <h1 className="mb-3 text-3xl md:text-4xl font-bold">Havenly Premium</h1>
        <p className="mb-8 max-w-2xl text-slate-300">
          Premium is designed for people who want a steadier emotional baseline,
          deeper clarity, and a gentle AI companion for reflection over time.
        </p>

        <div className="mb-10 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-200">
          <p className="mb-1">
            Current plan:{" "}
            <span className="font-semibold text-emerald-300">
              {planLabel}
            </span>
          </p>
          <p className="text-slate-400">
            Credits:{" "}
            <span className="font-semibold text-slate-100">{credits}</span>
            {renewalDate && (
              <>
                {" "}
                · Renews on{" "}
                <span className="font-semibold">
                  {new Date(renewalDate).toLocaleDateString()}
                </span>
              </>
            )}
          </p>
        </div>

        {isPremium ? (
          <>
            <p className="mb-6 text-slate-300">
              You are already a Havenly Premium member. As new features roll
              out, they will appear automatically in your dashboard and tools.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
              >
                Go to dashboard
              </Link>
              <Link
                href="/settings"
                className="rounded-full bg-slate-800 px-6 py-2.5 text-sm hover:bg-slate-700"
              >
                Manage settings
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 rounded-xl border border-emerald-500 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              Premium features are rolling out gradually. You can upgrade now to
              be among the first to receive deeper AI reflections, weekly
              wellness summaries, and personalised guidance.
            </div>

            <p className="mb-6 text-slate-300">
              Havenly Premium will include:
            </p>
            <ul className="mb-10 space-y-3 text-sm text-slate-300">
              <li>• Deep AI reflections on important journal entries</li>
              <li>• Weekly wellness reports across mood and themes</li>
              <li>• Personalised roadmap suggestions for the month ahead</li>
              <li>• Priority access to new tools and experiments</li>
              <li>• Better use of your credits across richer features</li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/upgrade"
                className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
              >
                View plans & upgrade
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-800 px-6 py-2.5 text-sm hover:bg-slate-700"
              >
                Back to dashboard
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
