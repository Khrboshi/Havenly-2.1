"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

interface JournalEntry {
  id: string;
  created_at: string;
  mood: number | null;
  content: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setUserEmail(session.user.email ?? null);

      const { data: entries } = await supabaseClient
        .from("journal_entries")
        .select("id, created_at, mood, content")
        .order("created_at", { ascending: false })
        .limit(3);

      setRecentEntries(entries ?? []);
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-20 text-center text-slate-300">
        Loading your space…
      </div>
    );
  }

  const displayName = userEmail
    ? userEmail.split("@")[0].charAt(0).toUpperCase() +
      userEmail.split("@")[0].slice(1)
    : "there";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-12 text-slate-200">
      {/* Welcome Section */}
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, <span className="text-emerald-300">{displayName}</span>
        </h1>
        <p className="max-w-xl text-slate-400 text-sm md:text-base">
          This is your calm space to slow down for a moment, breathe, and notice
          how you are really doing today.
        </p>

        <div>
          <Link
            href="/journal/new"
            className="inline-flex items-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-300"
          >
            Start today’s reflection
          </Link>
        </div>
      </section>

      {/* Recent Entries */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Recent reflections
        </h2>

        {recentEntries.length === 0 ? (
          <p className="text-slate-400 text-sm">
            You haven’t written anything yet — your first reflection will appear
            here.
          </p>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="block rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:border-emerald-400/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {entry.mood !== null && (
                    <span className="text-emerald-300">
                      Mood: {entry.mood}/5
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-200 line-clamp-2">
                  {entry.content || "(no text)"}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div>
          <Link
            href="/journal"
            className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
          >
            View full journal →
          </Link>
        </div>
      </section>
    </div>
  );
}
