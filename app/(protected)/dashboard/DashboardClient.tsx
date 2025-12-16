"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";
import UpgradeNudge from "@/app/components/UpgradeNudge";

type JournalEntry = {
  id: string;
  created_at: string;
  title: string | null;
  content: string | null;
  reflection: string | null;
};

export default function DashboardClient({ userId }: { userId: string }) {
  const { supabase, session } = useSupabase();
  const { loading: planLoading, planType, credits } = useUserPlan();

  const [latest, setLatest] = useState<JournalEntry | null>(null);
  const [loadingLatest, setLoadingLatest] = useState(true);

  const email = session?.user?.email ?? null;

  // -----------------------------
  // Load latest journal entry
  // -----------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      setLoadingLatest(true);

      const { data } = await supabase
        .from("journal_entries")
        .select("id, created_at, title, content, reflection")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        setLatest(data ?? null);
        setLoadingLatest(false);
      }
    }

    loadLatest();

    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  // -----------------------------
  // Plan & credits logic
  // -----------------------------
  const readablePlan =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  const isPremium = planType === "PREMIUM" || planType === "TRIAL";

  const numericCredits =
    typeof credits === "number" && credits >= 0 ? credits : null;

  const showCreditNudge =
    !planLoading &&
    !isPremium &&
    numericCredits !== null &&
    numericCredits <= 3;

  // -----------------------------
  // Retention intelligence
  // -----------------------------
  const hasUnreflectedEntry =
    latest && latest.content && !latest.reflection;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-24 text-slate-200">
      {/* HEADER */}
      <section className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back{email ? `, ${email.split("@")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A calm space to see how you’ve been doing and decide what you need today.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-200">
            {planLoading ? "Checking plan…" : `${readablePlan} plan`}
          </span>
        </div>
      </section>

      {/* PRIMARY ACTION */}
      <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-sm font-semibold text-slate-100">
          {hasUnreflectedEntry
            ? "Continue where you left off"
            : "Today’s check-in"}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {hasUnreflectedEntry
            ? "You started writing recently. You can return gently, or leave it as it is."
            : "Take a few quiet minutes to write about what’s on your mind. Nothing needs fixing."}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {hasUnreflectedEntry ? (
            <Link
              href={`/journal/${latest.id}`}
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
            >
              Continue reflection
            </Link>
          ) : (
            <Link
              href="/journal/new"
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
            >
              Start a new reflection
            </Link>
          )}

          <Link
            href="/journal"
            className="rounded-full bg-slate-800 px-5 py-2.5 text-sm text-slate-100 hover:bg-slate-700"
          >
            View journal history
          </Link>
        </div>
      </section>

      {/* UPGRADE NUDGE */}
      {!isPremium && (
        <section className="mb-10">
          <UpgradeNudge
            credits={numericCredits}
            variant={showCreditNudge ? "credits" : "default"}
          />
        </section>
      )}

      {/* VALUE TEASERS */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-slate-100">
            Patterns, not pressure
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Havenly looks for meaning over time — without turning your life into a task list.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-slate-100">
            Return when it feels right
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            There are no streaks here. Just space to think, whenever you need it.
          </p>
        </div>
      </section>
    </div>
  );
}
