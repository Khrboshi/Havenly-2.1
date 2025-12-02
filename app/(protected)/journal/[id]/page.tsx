"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Reflection = {
  id: string;
  createdAt: string;
  content: string;
};

const STORAGE_KEY = "havenly_journal_entries";

function loadLocalEntries(): Reflection[] {
  try {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    return stored ? (JSON.parse(stored) as Reflection[]) : [];
  } catch {
    return [];
  }
}

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.id as string;

  const [entry, setEntry] = useState<Reflection | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!entryId) return;

    const all = loadLocalEntries();
    const found = all.find((e) => e.id === entryId);

    if (!found) {
      setNotFound(true);
    } else {
      setEntry(found);
    }
  }, [entryId]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-20 text-center text-slate-300">
        Entry not found.
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-20 text-center text-slate-300">
        Loading...
      </div>
    );
  }

  const formattedDate = new Date(entry.createdAt).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-12 text-slate-200">
      {/* Header */}
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Reflection from
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          {formattedDate}
        </h1>
      </section>

      {/* Content */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <p className="whitespace-pre-line text-slate-200 text-base leading-relaxed">
          {entry.content}
        </p>
      </section>

      {/* Navigation */}
      <section className="flex flex-wrap gap-4 pt-4">
        <Link
          href="/journal"
          className="rounded-full bg-slate-800 px-5 py-2 text-sm hover:bg-slate-700"
        >
          Back to journal history
        </Link>

        <Link
          href="/journal/new"
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm text-slate-900 hover:bg-emerald-300"
        >
          Write a new reflection
        </Link>

        <Link
          href="/dashboard"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm hover:bg-slate-800"
        >
          Return to dashboard
        </Link>
      </section>

      <p className="pt-8 text-xs text-slate-500">
        Your reflections are stored locally on this device only.
      </p>
    </div>
  );
}
