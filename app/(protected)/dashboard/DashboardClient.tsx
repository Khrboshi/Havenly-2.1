"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

type DashboardClientProps = {
  userId: string;
};

type JournalEntry = {
  id: string;
  title: string | null;
  created_at: string;
};

function formatDateSafe(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const { supabase } = useSupabase();
  const { planType, credits, loading: planLoading } = useUserPlan();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const creditsValue = credits ?? 0;

  const readablePlan =
    planType === "PREMIUM"
      ? "Premium"
      : planType === "TRIAL"
      ? "Trial"
      : "Free";

  const canCreate =
    planType === "PREMIUM" ? true : creditsValue > 0 || planType === "TRIAL";

  const loadEntries = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("journal_entries")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) {
      setEntries((data as JournalEntry[]) || []);
    }

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back. Your plan:{" "}
            <span className="text-slate-200">{readablePlan}</span>
            {!planLoading && planType !== "PREMIUM" ? (
              <>
                {" "}
                — credits:{" "}
                <span className="text-slate-200">{creditsValue}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/journal"
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            View Journal
          </Link>

          <Link
            href={canCreate ? "/journal/new" : "/upgrade"}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              canCreate
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : "bg-white/10 text-slate-300 hover:bg-white/15"
            }`}
          >
            New entry
          </Link>
        </div>
      </div>

      {/* Above-the-fold: Next action + progress */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Your next step</h2>
              <p className="text-slate-400 text-sm mt-1">
                Write one sentence. Then generate a reflection.
              </p>
            </div>
            <Link
              href={canCreate ? "/journal/new" : "/upgrade"}
              className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium ${
                canCreate
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-white/10 text-slate-300 hover:bg-white/15"
              }`}
            >
              {canCreate ? "Start now" : "Upgrade to continue"}
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-slate-400">Plan</span>
            <span className="text-slate-200 font-medium">{readablePlan}</span>
            {planType !== "PREMIUM" ? (
              <>
                <span className="text-slate-400">Credits</span>
                <span className="text-slate-200 font-medium">
                  {planLoading ? "…" : creditsValue}
                </span>
              </>
            ) : (
              <>
                <span className="text-slate-400">Credits</span>
                <span className="text-slate-200 font-medium">Unlimited</span>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/tools/mood"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Mood check
            </Link>
            <Link
              href="/tools/reflection"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Guided reflection
            </Link>
            <Link
              href="/insights"
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Insights
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent entries</h2>
          <Link
            href="/journal"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            See all
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading your entries…</p>
        ) : entries.length === 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-slate-400">
              No entries yet. Create your first one in under 30 seconds.
            </p>
            <Link
              href={canCreate ? "/journal/new" : "/upgrade"}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                canCreate
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-white/10 text-slate-300 hover:bg-white/15"
              }`}
            >
              {canCreate ? "Create first entry" : "Upgrade to create"}
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {entries.map((e) => (
              <li key={e.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {e.title?.trim() ? e.title : "Untitled entry"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDateSafe(e.created_at)}
                  </p>
                </div>
                <Link
                  href={`/journal/${e.id}`}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
