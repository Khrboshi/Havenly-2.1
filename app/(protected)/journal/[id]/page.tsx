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

export const dynamic = "force-dynamic";

export default function JournalEntryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    async function loadEntry() {
      try {
        const res = await fetch(`/api/journal/${params.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Entry not found");
        }

        const data = (await res.json()) as JournalEntry;
        setEntry(data);
      } catch {
        setError("This entry could not be found.");
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [params?.id]);

  if (loading) {
    return <div className="p-6 text-slate-400">Loading…</div>;
  }

  if (error || !entry) {
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

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      {entry.title && (
        <h1 className="text-2xl font-semibold">{entry.title}</h1>
      )}

      <p className="whitespace-pre-wrap text-slate-200">
        {entry.content}
      </p>

      {entry.reflection && (
        <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-800">
          <h2 className="font-medium mb-2">Reflection</h2>
          <p className="whitespace-pre-wrap text-slate-300">
            {entry.reflection}
          </p>
        </div>
      )}
    </div>
  );
}
