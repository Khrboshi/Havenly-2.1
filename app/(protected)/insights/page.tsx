"use client";

import { useEffect, useState } from "react";

type Reflection = {
  id: string;
  createdAt: string;
  content: string;
};

const STORAGE_KEY = "havenly_journal_entries";

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

  // Very soft "word count"
  const totalWords = entries.reduce(
    (acc, e) => acc + e.content.split(/\s+/).length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-slate-200">
      {/* ---- Page header ---- */}
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Insights
      </h1>
      <p className="text-slate-400 mb-10">
        A gentle overview of your journaling pattern so far.
      </p>

      {/* ---- No data: encourage journaling ---- */}
      {totalEntries === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300 text-sm">
          You haven&apos;t written any reflections yet.  
          Once you add a few entries, you’ll see patterns appear here.
        </div>
      )}

      {/* ---- Stats cards ---- */}
      {totalEntries > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <StatCard label="Total reflections" value={totalEntries} />
          <StatCard label="Total words" value={totalWords} />
          <StatCard
            label="Average words per entry"
            value={Math.round(totalWords / totalEntries)}
          />
        </div>
      )}

      {/* ---- Coming soon premium section ---- */}
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
    </div>
  );
}

/* --------------------------
   Small reusable stat card
----------------------------*/
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
