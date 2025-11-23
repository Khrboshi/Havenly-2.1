"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type JournalEntry = {
  id: string;
  created_at: string;
  mood: number | null;
  content: string | null;
  ai_response: string | null;
};

export default function JournalHistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabaseClient
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error(error);
      } else {
        setEntries(data || []);
      }

      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return <p className="text-sm text-slate-300 mt-6">Loading entries…</p>;
  }

  if (!entries.length) {
    return (
      <div className="mt-6 space-y-3">
        <p className="text-sm text-slate-300">
          No entries yet. Start with your first reflection.
        </p>
        <Link
          href="/journal/new"
          className="inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300"
        >
          Write today&apos;s reflection
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your reflections</h1>
        <Link
          href="/journal/new"
          className="text-xs rounded-full border border-emerald-400/70 px-3 py-1.5 text-emerald-200 hover:bg-emerald-400 hover:text-slate-950 transition"
        >
          New entry
        </Link>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-2"
          >
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>
                {new Date(entry.created_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              {entry.mood && (
                <span className="text-emerald-300">
                  Mood {entry.mood}
                  <span className="text-slate-500">/5</span>
                </span>
              )}
            </div>

            <p className="text-sm text-slate-100 whitespace-pre-wrap">
              {entry.content}
            </p>

            {entry.ai_response && (
              <div className="mt-2 border-t border-slate-800 pt-2">
                <p className="text-[11px] text-emerald-300 mb-1">
                  Havenly reflection
                </p>
                <p className="text-xs text-slate-200 whitespace-pre-wrap">
                  {entry.ai_response}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
