"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  created_at: string;
  content: string | null;
};

export default function InsightsPage() {
  const { supabase, session } = useSupabase();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;

    async function loadEntries() {
      setLoading(true);
      const { data } = await supabase
        .from("journal_entries")
        .select("id, created_at, content")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setEntries((data as JournalEntry[]) || []);
      setLoading(false);
    }

    loadEntries();
  }, [supabase, session]);

  const totalEntries = entries.length;
  const totalWords = entries.reduce((acc, e) => {
    if (!e.content) return acc;
    return acc + e.content.split(/\s+/).filter(Boolean).length;
  }, 0);
  const avgWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-slate-200">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Insights</h1>
      <p className="text-slate-400 mb-10">
        A gentle overview of your journaling pattern so far.
      </p>

      {loading && (
        <p className="text-sm text-slate-400">Loading your insights…</p>
      )}

      {!loading && totalEntries === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300 text-sm">
          You haven&apos;t written any reflections yet. Once you add a few
          entries, you&apos;ll see patterns appear here.
        </div>
      )}

      {!loading && totalEntries > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            <StatCard label="Total reflections" value={totalEntries} />
            <StatCard label="Total words" value={totalWords} />
            <StatCard label="Average words per entry" value={avgWords} />
          </div>

          <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 mt-10">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Coming soon ✨
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Future Havenly Plus features will include emotional trends,
              sentiment patterns, gentle AI observations, and week-over-week
              progress insights — all private and for your eyes only.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
