"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Entry = {
  id: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "havenly_journal_entries";

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/journal/list", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/magic-login?redirectedFrom=/journal");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load reflections.");
        }

        const data = await res.json();
        const entriesFromApi: Entry[] = data.entries ?? [];

        if (!cancelled) {
          setEntries(entriesFromApi);

          // Keep localStorage in sync so Dashboard/Insights (old logic)
          // still work during the transition.
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entriesFromApi));
          } catch (e) {
            console.error("Failed syncing journal to localStorage:", e);
          }
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Error loading reflections.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-slate-200">
      {/* Header */}
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Your journal
      </h1>
      <p className="text-slate-400 mb-8">
        Browse past reflections and notice how your thoughts and emotions
        evolve over time.
      </p>

      {/* Actions */}
      <div className="mb-10">
        <Link
          href="/journal/new"
          className="inline-flex items-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300 transition"
        >
          Start a new reflection
        </Link>
      </div>

      {/* Loading / error states */}
      {loading && (
        <p className="text-sm text-slate-400">Loading your reflections…</p>
      )}

      {error && !loading && (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300 text-sm">
          You haven&apos;t written any reflections yet. Your first entry will
          appear here once you save it.
        </div>
      )}

      {/* Entries list */}
      <div className="space-y-3">
        {entries.map((entry) => {
          const date = new Date(entry.createdAt);
          const preview =
            entry.content.length > 140
              ? entry.content.slice(0, 140) + "…"
              : entry.content;

          return (
            <Link
              key={entry.id}
              href={`/journal/${entry.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4 hover:bg-slate-900 transition"
            >
              <p className="text-xs text-slate-500 mb-1">
                {date.toLocaleString()}
              </p>
              <p className="text-sm text-slate-200">{preview || "—"}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
