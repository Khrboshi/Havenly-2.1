"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const email = session?.user?.email ?? "";
  const numericCredits = typeof credits === "number" ? credits : 0;

  const isPremium = planType === "PREMIUM" || planType === "TRIAL";

  useEffect(() => {
    async function loadEntries() {
      setLoadingEntries(true);

      const { data } = await supabase
        .from("journal_entries")
        .select("id, created_at, title, content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(7);

      setEntries(data ?? []);
      setLoadingEntries(false);
    }

    loadEntries();
  }, [supabase, userId]);

  const latest = entries[0] ?? null;

  const entriesThisWeek = useMemo(() => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    return entries.filter((e) => new Date(e.created_at) >= startOfWeek);
  }, [entries]);

  const canStartReflection = numericCredits > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-24 text-slate-200">
      {/* HEADER */}
      <section className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back{email ? `, ${email.split("@")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A calm space to notice how things have been unfolding.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          {planLoading ? "Checking plan…" : `${isPremium ? "Premium" : "Free"} plan`}
          <span className="ml-2 text-slate-300">· Credits: {numericCredits}</span>
        </div>
      </section>

      {/* TODAY */}
      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-sm font-semibold text-slate-100">Today’s check-in</h2>
        <p className="mt-2 text-sm text-slate-400">
          You don’t need to solve anything. Just write what’s here.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {canStartReflection ? (
            <Link
              href="/journal/new"
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
            >
              Start a new reflection
            </Link>
          ) : (
            <Link
              href="/journal"
              className="rounded-full bg-slate-800 px-5 py-2.5 text-sm text-slate-100 hover:bg-slate-700"
            >
              View journal history
            </Link>
          )}

          {/* IMPORTANT: avoid duplicate button when credits = 0 */}
          {canStartReflection && (
            <Link
              href="/journal"
              className="rounded-full bg-slate-800 px-5 py-2.5 text-sm text-slate-100 hover:bg-slate-700"
            >
              View journal history
            </Link>
          )}
        </div>
      </section>

      {/* THIS WEEK */}
      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-sm font-semibold text-slate-100">This week so far</h3>

          <p className="mt-2 text-sm text-slate-400">
            {entriesThisWeek.length === 0
              ? "No reflections yet this week."
              : `You’ve written ${entriesThisWeek.length} reflection${
                  entriesThisWeek.length > 1 ? "s" : ""
                } this week.`}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-sm font-semibold text-slate-100">Insight preview</h3>

          <p className="mt-2 text-sm text-slate-400">
            {isPremium
              ? "Your emotional timelines and themes will appear here."
              : "Premium reveals patterns across your entries — gently, over time."}
          </p>

          {!isPremium && (
            <Link
              href="/upgrade"
              className="mt-3 inline-flex rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Explore Premium
            </Link>
          )}
        </div>
      </section>

      {/* LATEST ENTRY / EMPTY STATE */}
      <section className="mb-8">
        {loadingEntries && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
            Loading your reflections…
          </div>
        )}

        {!loadingEntries && entries.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
            Your space is ready. Your first reflection can be short.
          </div>
        )}

        {!loadingEntries && latest && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-sm font-semibold text-slate-100">
              Most recent reflection
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {new Date(latest.created_at).toLocaleString()}
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
              {latest.content && latest.content.length > 300
                ? latest.content.slice(0, 300) + "…"
                : latest.content}
            </p>

            <Link
              href={`/journal/${latest.id}`}
              className="mt-3 inline-block text-sm text-emerald-400 hover:underline"
            >
              Read full entry →
            </Link>
          </div>
        )}
      </section>

      {/* UPGRADE NUDGE — ONLY WHEN IT MAKES SENSE */}
      {!isPremium && numericCredits > 0 && (
        <UpgradeNudge
          credits={numericCredits}
          variant={numericCredits <= 3 ? "credits" : "default"}
        />
      )}
    </div>
  );
}
