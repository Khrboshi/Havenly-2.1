"use client";

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
   Insights Page
--------------------------------*/
export default function InsightsPage() {
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
      console.error("Failed to load insights:", err);
    }
  }, []);

  const totalEntries = entries.length;
  const totalWords = entries.reduce(
    (acc, e) => acc + e.content.split(/\s+/).length,
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-28 text-slate-200">

      {/* HEADER */}
      <section className="mb-14 animate-fadeIn">
        <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">
          Insights
        </h1>
        <p className="text-slate-400 text-base">
          A gentle overview of your journaling pattern so far.
        </p>
      </section>

      {/* IF EMPTY */}
      {totalEntries === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-slate-300 text-sm animate-fadeInUp">
          You haven’t written any reflections yet.
          <br />
          Once you add a few entries, patterns will appear here.
        </div>
      )}

      {/* STAT CARDS */}
      {totalEntries > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16 animate-fadeInUp">
          <StatCard label="Total reflections" value={totalEntries} />
          <StatCard label="Total words" value={totalWords} />
          <StatCard
            label="Average words per entry"
            value={Math.round(totalWords / totalEntries)}
          />
        </div>
      )}

      {/* COMING SOON */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 animate-fadeInUp">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">
          Coming soon ✨
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed">
          Future Havenly Plus features will include emotional trends,
          sentiment patterns, gentle AI observations, and week-over-week
          progress insights — all private and for your eyes only.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------
   Stat Card Component
--------------------------------*/
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm shadow-black/20">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
