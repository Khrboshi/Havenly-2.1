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

export default function JournalListPage() {
  const { supabase, session } = useSupabase();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    async function loadEntries() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("journal_entries")
          .select("id, created_at, title, content")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error(fetchError);
          throw new Error("Could not load your journal entries.");
        }

        setEntries(data || []);
      } catch (err: any) {
        setError(err.message ?? "Unexpected error loading entries.");
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, [supabase, session]);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-24 text-slate-200">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Your journal
      </h1>
      <p className="text-slate-400 mb-8">
        Browse past reflections and notice how your thoughts and emotions
        evolve over time.
      </p>

      <div className="mb-8">
        <Link
          href="/journal/new"
          className="inline-flex rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300 transition"
        >
          Start a new reflection
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Loading your reflections…</p>
      )}

      {error && (
        <p className="text-sm text-rose-400 bg-rose-900/20 border border-rose-700/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-sm text-slate-400">
          You haven&apos;t written anything yet — your first entry will appear
          here once you check in.
        </p>
      )}

      <div className="space-y-4 mt-4">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/journal/${entry.id}`}
            className="block rounded-xl bg-slate-900/60 border border-slate-800 px-5 py-4 hover:border-emerald-400/60 transition"
          >
            <p className="text-xs text-slate-500 mb-1">
              {new Date(entry.created_at).toLocaleString()}
            </p>
            <p className="text-sm font-medium text-slate-100 mb-1">
              {entry.title?.trim() || "Untitled reflection"}
            </p>
            <p className="text-sm text-slate-300 line-clamp-2">
              {entry.content || ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
