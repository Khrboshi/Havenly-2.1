"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ------------------------------
   Types & Local Storage constants
--------------------------------*/
type Reflection = {
  id: string;
  createdAt: string;
  content: string;
};

const STORAGE_KEY = "havenly_journal_entries";

/* ------------------------------
   Dashboard Page
--------------------------------*/
export default function DashboardPage() {
  const [entries, setEntries] = useState<Reflection[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Reflection[];
      const sorted = parsed.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      );

      setEntries(sorted);
    } catch (err) {
      console.error("Failed loading journal entries:", err);
    }
  }, []);

  const latest = entries[0];

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-28 text-slate-200">

      {/* HEADER */}
      <section className="mb-12 animate-fadeIn">
        <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">
          Welcome back <span className="inline-block">👋</span>
        </h1>

        <p className="text-slate-400 text-base">
          A gentle space to check in with yourself.
        </p>
      </section>

      {/* QUICK ACTIONS */}
      <section className="flex flex-wrap gap-4 mb-14 animate-fadeInUp">
        <Link
          href="/journal/new"
          className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/20"
        >
          Start a new reflection
        </Link>

        <Link
          href="/journal"
          className="bg-slate-800 px-6 py-3 rounded-full text-sm hover:bg-slate-700 transition-all border border-slate-700/50"
        >
          View journal history
        </Link>
      </section>

      {/* MOST RECENT REFLECTION */}
      {!latest && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-slate-400 text-sm animate-fadeInUp">
          You haven’t saved any reflections yet.
          <br />
          Your first entry will appear here.
        </div>
      )}

      {latest && (
        <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 mb-16 animate-fadeInUp space-y-4">
          <h2 className="text-lg font-medium text-white">
            Most recent reflection
          </h2>

          <p className="text-xs text-slate-500">
            {new Date(latest.createdAt).toLocaleString()}
          </p>

          <p className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
            {latest.content.length > 350
              ? latest.content.slice(0, 350) + "…"
              : latest.content}
          </p>

          <Link
            href={`/journal/${latest.id}`}
            className="inline-block text-emerald-400 text-sm hover:underline"
          >
            Read full entry →
          </Link>
        </section>
      )}

      {/* COMING SOON */}
      <section className="rounded-2xl bg-slate-950/40 border border-slate-800 p-8 animate-fadeInUp">
        <h2 className="text-lg font-semibold mb-2 text-white">
          Coming soon ✨
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed">
          AI-assisted reflections, cloud backup, and cross-device sync will be
          available in future premium plans.
        </p>
      </section>
    </div>
  );
}
