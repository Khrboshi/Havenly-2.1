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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadEntry() {
      try {
        const res = await fetch(`/api/journal/${id}`);

        if (!res.ok) {
          setError("This entry could not be found.");
          return;
        }

        const data = await res.json();
        setEntry(data);
      } catch {
        setError("Failed to load entry.");
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-slate-400">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.push("/journal")}
          className="text-emerald-400 hover:underline"
        >
          ← Back to journal
        </button>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {entry.title ?? "Journal entry"}
      </h1>

      <p className="text-slate-300 whitespace-pre-wrap">
        {entry.content}
      </p>

      {entry.reflection && (
        <div className="border-t border-slate-800 pt-4">
          <h2 className="text-lg font-medium mb-2">AI Reflection</h2>
          <p className="text-slate-400 whitespace-pre-wrap">
            {entry.reflection}
          </p>
        </div>
      )}
    </div>
  );
}
