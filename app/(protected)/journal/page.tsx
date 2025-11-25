"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

interface JournalEntry {
  id: string;
  created_at: string;
  content: string | null;
  mood: number | null;
}

export default function JournalHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [entriesByMonth, setEntriesByMonth] = useState<
    Record<string, JournalEntry[]>
  >({});

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabaseClient
        .from("journal_entries")
        .select("id, created_at, mood, content")
        .order("created_at", { ascending: false });

      const grouped: Record<string, JournalEntry[]> = {};

      (data ?? []).forEach((entry) => {
        const date = new Date(entry.created_at);
        const monthLabel = date.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        });

        if (!grouped[monthLabel]) {
          grouped[monthLabel] = [];
        }
        grouped[monthLabel].push(entry);
      });

      setEntriesByMonth(grouped);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-20 text-center text-slate-300">
        Loading your journal…
      </div>
    );
  }

  const hasEntries = Object.keys(entriesByMonth).length > 0;

  function moodEmoji(mood: number | null) {
    if (mood === 1) return "😔";
    if (mood === 2) return "😕";
    if (mood === 3) return "😐";
    if (mood === 4) return "🙂";
    if (mood === 5) return "😊";
    return "";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-12 text-slate-200">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Your journal</h1>
        <p className="max-w-xl text-slate-400 text-sm md:text-base">
          Browse past reflections and notice how your thoughts and emotions
          evolve over time.
        </p>
      </section>

      {!hasEntries && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-slate-300 text-sm">
          You haven’t saved any reflections yet. Your writing will appear here
          once you complete your first entry.
          <div className="mt-4">
            <Link
              href="/journal/new"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Start your first reflection
            </Link>
          </div>
        </div>
      )}

      {hasEntries &&
        Object.entries(entriesByMonth).map(([month, entries]) => (
          <div key={month} className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              {month}
            </h2>

            <div className="space-y-3">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.id}`}
                  className="block rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:border-emerald-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-lg">{moodEmoji(entry.mood)}</span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {entry.content || "(no text)"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
