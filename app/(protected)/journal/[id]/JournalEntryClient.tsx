"use client";

import Link from "next/link";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function JournalEntryClient({
  entry,
}: {
  entry: JournalEntry;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10 text-white">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {entry.title || "Untitled"}
        </h1>

        <Link
          href="/journal"
          className="text-sm text-emerald-400 hover:underline"
        >
          ← Back to journal
        </Link>
      </header>

      <p className="text-xs text-white/50">
        {new Date(entry.created_at).toLocaleString()}
      </p>

      <article className="whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900/60 p-6 leading-relaxed">
        {entry.content}
      </article>
    </div>
  );
}
