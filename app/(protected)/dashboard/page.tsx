import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "ESSENTIAL" | "PREMIUM";

function getPlanCopy(planType: PlanType) {
  if (planType === "PREMIUM") {
    return {
      label: "Premium",
      message:
        "You’re on the Premium plan — all tools and AI reflections are available as they roll out.",
    };
  }
  if (planType === "ESSENTIAL") {
    return {
      label: "Essential",
      message:
        "You’re on the Essential plan — journaling, habits, and light AI summaries are included.",
    };
  }
  return {
    label: "Free",
    message:
      "You’re using the Free plan — daily journaling and calming tools are always available.",
  };
}

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login?from=dashboard");
  }

  const user = session.user;

  let planType: PlanType = "FREE";
  let credits = 0;

  try {
    const { data: planRow, error } = await supabase
      .from("user_plans")
      .select("plan_type, credits_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && planRow) {
      planType = (planRow.plan_type as PlanType) || "FREE";
      credits = planRow.credits_balance ?? 0;
    }
  } catch (err) {
    console.error("Error loading plan in DashboardPage:", err);
  }

  const displayName =
    (user.user_metadata as any)?.full_name ||
    user.email?.split("@")[0] ||
    "Friend";

  const { label: planLabel, message: planMessage } = getPlanCopy(planType);

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-24 px-6 text-slate-200">
      {/* Plan banner */}
      <div className="mb-10 rounded-lg border border-emerald-700/30 bg-emerald-900/20 p-4 text-sm text-emerald-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>
            <span className="font-semibold text-emerald-300">
              {planLabel} plan
            </span>{" "}
            · {planMessage}
          </p>
          <p className="text-emerald-200/80 text-xs sm:text-sm">
            Credits:{" "}
            <span className="font-semibold text-emerald-100">{credits}</span>
          </p>
        </div>
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-semibold text-white mb-2">
        Welcome back, <span className="text-emerald-300">{displayName}</span>
      </h1>
      <p className="text-slate-400 mb-8">
        Take a moment to breathe and check in with yourself today.
      </p>

      {/* Primary Action */}
      <Link
        href="/journal/new"
        className="mb-12 inline-block rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-300"
      >
        Start today’s reflection
      </Link>

      {/* Quick Action Cards */}
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        <Link
          href="/journal"
          className="block rounded-xl border border-slate-700/40 bg-slate-800/40 p-5 transition hover:bg-slate-800/60"
        >
          <h3 className="mb-1 text-lg font-semibold text-white">Journal</h3>
          <p className="text-sm text-slate-400">
            Write a daily reflection and build a gentle record of your days.
          </p>
        </Link>

        <Link
          href="/tools"
          className="block rounded-xl border border-slate-700/40 bg-slate-800/40 p-5 transition hover:bg-slate-800/60"
        >
          <h3 className="mb-1 text-lg font-semibold text-white">
            Breathing & tools
          </h3>
          <p className="text-sm text-slate-400">
            Use simple breathing and check-in tools when things feel heavy.
          </p>
        </Link>

        <Link
          href="/insights"
          className="block rounded-xl border border-slate-700/40 bg-slate-800/40 p-5 transition hover:bg-slate-800/60"
        >
          <h3 className="mb-1 text-lg font-semibold text-white">
            Insights (coming online)
          </h3>
          <p className="text-sm text-slate-400">
            Emotional patterns, weekly summaries, and clarity insights powered
            by your reflections.
          </p>
        </Link>
      </div>

      {/* Recent reflections placeholder */}
      <div>
        <h2 className="mb-3 text-xl font-semibold text-white">
          Recent reflections
        </h2>
        <p className="mb-6 text-slate-400">
          You haven’t written anything yet — your first entry will appear here
          once you check in.
        </p>

        <Link
          href="/journal"
          className="text-sm text-emerald-300 hover:underline"
        >
          View full journal →
        </Link>
      </div>
    </div>
  );
}
