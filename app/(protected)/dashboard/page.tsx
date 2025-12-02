"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Reflection = {
  id: string;
  createdAt: string;
  content: string;
};

const STORAGE_KEY = "havenly_journal_entries";

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
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-24 text-slate-200">
      {/* ---- Header ---- */}
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-slate-400 mt-1">
          A gentle space to check in with yourself.
        </p>
      </section>

      {/* ---- Quick actions ---- */}
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

      {/* ---- Latest entry preview ---- */}
      {!latest && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 text-slate-400 text-sm">
          You haven’t saved any reflections yet.  
          Your first entry will appear here.
        </div>
      )}

      {latest && (
        <section className="space-y-4 rounded-xl bg-slate-900/60 border border-slate-800 p-6">
          <h2 className="text-lg font-medium text-slate-100">
            Most recent reflection
          </h2>

          <p className="text-xs text-slate-500">
            {new Date(latest.createdAt).toLocaleString()}
          </p>

          <p className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed">
            {latest.content.length > 350
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

      {/* ---- Coming soon (premium) ---- */}
      <section className="mt-12">
        <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-6">
          <h2 className="text-lg font-semibold mb-2 text-slate-100">
            Coming soon ✨
          </h2>
          <p className="text-sm text-slate-400">
            AI-assisted reflections, cloud backup, and cross-device sync will be
            available in future premium plans.
          </p>
        </div>
      </section>
    </div>
  );
}
