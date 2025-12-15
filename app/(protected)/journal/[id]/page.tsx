"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  useEffect(() => {
    if (!id) return;

    async function loadEntry() {
      try {
        const res = await fetch(`/api/journal/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setEntry(null);
          return;
        }

        const data: JournalEntry = await res.json();
        setEntry(data);
      } catch {
        setEntry(null);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  if (loading) {
    return <p className="text-slate-400">Loading entry…</p>;
  }

  if (!entry) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">This entry could not be found.</p>
        <button
          onClick={() => router.push("/journal")}
          className="text-emerald-400 hover:underline"
        >
          ← Back to journal
        </button>
      </div>
    );
  }

  return (
    <article className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">
        {entry.title ?? "Journal entry"}
      </h1>

      <p className="text-slate-400 text-sm">
        {new Date(entry.created_at).toLocaleString()}
      </p>

      <div className="whitespace-pre-wrap text-slate-100">
        {entry.content}
      </div>

      {entry.reflection && (
        <div className="border-t border-slate-800 pt-4">
          <h2 className="text-lg font-medium mb-2">Reflection</h2>
          <p className="whitespace-pre-wrap text-slate-200">
            {entry.reflection}
          </p>
        </div>
      )}
    </article>
  );
}
