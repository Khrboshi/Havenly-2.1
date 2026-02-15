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

export default function DashboardClient({ userId }: DashboardClientProps) {
  const { supabase } = useSupabase();
  const { planType, credits, loading: planLoading } = useUserPlan();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const readablePlan =
    planType === "PREMIUM" ? "Premium" : planType === "TRIAL" ? "Trial" : "Free";

  const canCreate =
    planType === "PREMIUM" ? true : (credits ?? 0) > 0 || planType === "TRIAL";

  const loadEntries = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("journal_entries")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) setEntries((data as JournalEntry[]) || []);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-10">
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
                — credits: <span className="text-slate-200">{credits ?? 0}</span>
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
          <div className="text-slate-400">
            <p className="mb-3">No entries yet. Create your first one.</p>
            <Link
              href={canCreate ? "/journal/new" : "/upgrade"}
              className={`inline-flex rounded-md px-4 py-2 text-sm font-medium ${
                canCreate
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-white/10 text-slate-300 hover:bg-white/15"
              }`}
            >
              {canCreate ? "Create entry" : "Upgrade to create"}
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
                    {new Date(e.created_at).toLocaleString()}
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
