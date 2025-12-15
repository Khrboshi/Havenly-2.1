"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

export default function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadEntry() {
      try {
        const res = await fetch(`/api/journal/${id}`);

        if (!res.ok) {
          throw new Error("Entry not found");
        }

        const data = (await res.json()) as JournalEntry;

        setEntry(data);
      } catch (err) {
        setError("This entry could not be found.");
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-slate-400">
        Loading entry…
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="p-8">
        <p className="text-red-400 mb-4">
          {error ?? "This entry could not be found."}
        </p>
        <Link
          href="/journal"
          className="inline-block text-emerald-400 hover:underline"
        >
          ← Back to journal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      {entry.title && (
        <h1 className="text-2xl font-semibold">
          {entry.title}
        </h1>
      )}

      <p className="text-slate-300 whitespace-pre-wrap">
        {entry.content}
      </p>

      {entry.reflection && (
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">
            Reflection
          </h2>
          <p className="text-slate-300 whitespace-pre-wrap">
            {entry.reflection}
          </p>
        </div>
      )}

      <div className="pt-6">
        <Link
          href="/journal"
          className="text-emerald-400 hover:underline"
        >
          ← Back to journal
        </Link>
      </div>
    </div>
  );
}
