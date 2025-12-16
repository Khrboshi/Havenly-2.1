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
        .select("id, created_at, title, content")
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

          {!planLoading && !isPremium && (
            <span className="text-[11px] text-slate-500">
              Credits available:{" "}
              <span className="font-medium text-slate-200">
                {numericCredits ?? 0}
              </span>
            </span>
          )}
        </div>
      </section>

      {/* PRIMARY CARDS */}
      <section className="mb-10 grid gap-4 md:grid-cols-[1.5fr,1.1fr]">
        {/* Today’s check-in */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-slate-100">
            Today’s check-in
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Take a few quiet minutes to write about what’s on your mind. You do
            not have to fix anything — just notice.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/journal/new"
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
            >
              Start a new reflection
            </Link>

            <Link
              href="/journal"
              className="rounded-full bg-slate-800 px-5 py-2.5 text-sm text-slate-100 hover:bg-slate-700"
            >
              View journal history
            </Link>
          </div>
        </div>

        {/* Plan & tools */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold text-slate-100">
            Your plan & tools
          </h2>

          <div className="mt-4 space-y-2 text-xs text-slate-300">
            {isPremium ? (
              <>
                <p>
                  You have access to{" "}
                  <span className="font-semibold text-emerald-300">
                    Premium tools
                  </span>{" "}
                  including deeper reflections and timelines.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/tools"
                    className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Explore tools
                  </Link>
                  <Link
                    href="/insights"
                    className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    View insights
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p>
                  You’re on the{" "}
                  <span className="font-semibold text-slate-100">Free</span>{" "}
                  plan — perfect for regular journaling. Premium adds clearer
                  timelines and deeper, multi-entry reflections.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/upgrade"
                    className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    Explore Premium
                  </Link>
                </div>
              </>
            )}
          </div>
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

      {/* LATEST ENTRY */}
      <section className="mb-10">
        {loadingLatest && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
            Loading your latest reflection…
          </div>
        )}

        {!loadingLatest && !latest && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
            You haven’t saved any reflections yet.
          </div>
        )}

        {!loadingLatest && latest && (
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-lg font-medium text-slate-100">
              Most recent reflection
            </h2>

            <p className="text-xs text-slate-500">
              {new Date(latest.created_at).toLocaleString()}
            </p>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {latest.content && latest.content.length > 350
                ? latest.content.slice(0, 350) + "…"
                : latest.content}
            </p>

            <Link
              href={`/journal/${latest.id}`}
              className="inline-block text-sm text-emerald-400 hover:underline"
            >
              Read full entry →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
