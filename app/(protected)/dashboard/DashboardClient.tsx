"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  created_at: string;
  title: string | null;
  content: string | null;
};

export default function DashboardClient({ userId }: { userId: string }) {
  const { supabase } = useSupabase();
  const [latest, setLatest] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatest() {
      setLoading(true);
      const { data } = await supabase
        .from("journal_entries")
        .select("id, created_at, title, content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setLatest(data ?? null);
      setLoading(false);
    }

    loadLatest();
  }, [supabase, userId]);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-24 text-slate-200">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-slate-400 mt-1">
          A gentle space to check in with yourself.
        </p>
      </section>

      <section className="mb-12 flex flex-wrap gap-4">
        <Link
          href="/journal/new"
          className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-300 transition"
        >
          Start a new reflection
        </Link>

        <Link
          href="/journal"
          className="bg-slate-800 px-6 py-3 rounded-full text-sm hover:bg-slate-700"
        >
          View journal history
        </Link>
      </section>

      {loading && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 text-slate-400 text-sm">
          Loading your latest reflection…
        </div>
      )}

      {!loading && !latest && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 text-slate-400 text-sm">
          You haven’t saved any reflections yet. Your first entry will appear
          here.
        </div>
      )}

      {!loading && latest && (
        <section className="space-y-4 rounded-xl bg-slate-900/60 border border-slate-800 p-6">
          <h2 className="text-lg font-medium text-slate-100">
            Most recent reflection
          </h2>

          <p className="text-xs text-slate-500">
            {new Date(latest.created_at).toLocaleString()}
          </p>

          <p className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed">
            {latest.content && latest.content.length > 350
              ? latest.content.slice(0, 350) + "…"
              : latest.content}
          </p>

          <Link
            href={`/journal/${latest.id}`}
            className="inline-block mt-2 text-emerald-400 text-sm hover:underline"
          >
            Read full entry →
          </Link>
        </section>
      )}

      <section className="mt-12">
        <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-2 text-slate-100">
            Coming soon ✨
          </h2>
          <p className="text-sm text-slate-400">
            AI-assisted reflections, cloud backup, and cross-device sync will
            be available in future premium plans.
          </p>
        </div>
      </section>
    </div>
  );
}
