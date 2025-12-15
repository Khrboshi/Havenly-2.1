"use client";

import { useState } from "react";
import Link from "next/link";

export default function JournalEntryPage({
  entry,
}: {
  entry: {
    id: string;
    title: string | null;
    content: string;
    created_at: string;
  };
}) {
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  async function generateReflection() {
    setLoading(true);
    setLimitReached(false);

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: entry.content }),
      });

      if (res.status === 403) {
        setLimitReached(true);
        return;
      }

      const data = await res.json();
      setReflection(data.reflection);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/journal"
        className="text-sm text-slate-400 hover:text-slate-200"
      >
        ← Back to journal
      </Link>

      <div className="rounded-xl bg-slate-900 p-6">
        <div className="text-xs text-slate-400 mb-1">
          {new Date(entry.created_at).toLocaleString()}
        </div>

        <h1 className="text-xl font-semibold mb-3">
          {entry.title || "Untitled"}
        </h1>

        <p className="whitespace-pre-wrap text-slate-200">
          {entry.content}
        </p>
      </div>

      {/* AI Reflection */}
      <div className="rounded-xl bg-slate-900 p-6">
        <h2 className="font-medium mb-2">AI Reflection</h2>

        {!reflection && !limitReached && (
          <button
            onClick={generateReflection}
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Reflecting…" : "Generate reflection"}
          </button>
        )}

        {reflection && (
          <p className="mt-3 whitespace-pre-wrap text-slate-200">
            {reflection}
          </p>
        )}

        {limitReached && (
          <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-sm">
            <p className="mb-2">
              You’ve reached today’s free reflection limit.
            </p>
            <Link
              href="/premium"
              className="font-medium text-amber-400 hover:underline"
            >
              Upgrade to unlock unlimited reflections →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
