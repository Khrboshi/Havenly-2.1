"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Reflection = {
  id: string;
  createdAt: string;
  content: string;
};

const STORAGE_KEY = "havenly_journal_entries";

function loadLocalEntries(): Reflection[] {
  try {
    const stored = typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;

    if (!stored) return [];
    const parsed = JSON.parse(stored) as Reflection[];

    // Newest first
    return parsed.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  } catch {
    return [];
  }
}

export default function JournalPage() {
  const [entries, setEntries] = useState<Reflection[]>([]);

  useEffect(() => {
    setEntries(loadLocalEntries());
  }, []);

  const hasEntries = entries.length > 0;

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-24 px-6 text-slate-200">
      <h1 className="text-3xl font-semibold mb-2">Your journal</h1>
      <p className="text-slate-400 mb-8">
        Browse past reflections and notice how your thoughts and emotions
        evolve over time.
      </p>

      {/* CTA row */}
      <div className="mb-10 flex flex-wrap items-center gap-4">
        <Link
          href="/journal/new"
          className="bg-emerald-400 text-slate-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-300 transition"
        >
          Start a new reflection
        </Link>

        {!hasEntries && (
          <span className="text-xs text-slate-500">
            Your writing is stored privately in this browser.
          </span>
        )}
      </div>

      {/* Empty state */}
      {!hasEntries && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-sm">
          You haven&apos;t saved any reflections yet. Your first entry will
          appear here once you complete it.
        </div>
      )}

      {/* List of entries */}
      {hasEntries && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="text-xs text-slate-500 mb-2">
                {new Date(entry.createdAt).toLocaleString()}
              </div>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">
                {entry.content}
              </p>
            </article>
          ))}
        </div>
      )}

      <p className="mt-10 text-xs text-slate-500">
        Right now your entries are kept locally on this device.
        In a future premium update, you&apos;ll be able to back them up
        securely in the cloud and sync across devices.
      </p>
    </div>
  );
}
