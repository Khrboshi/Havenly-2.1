"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ApiEntry = {
  id: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "havenly_journal_entries";

export default function NewJournalEntryPage() {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write a few words for your reflection.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/journal/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.status === 401) {
        router.push("/magic-login?redirectedFrom=/journal/new");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save reflection.");
      }

      const data = (await res.json()) as { entry: ApiEntry };
      const entry = data.entry;

      // Mirror into localStorage so existing Dashboard/Insights keep working
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const existing: ApiEntry[] = raw ? JSON.parse(raw) : [];
        const updated = [
          {
            id: entry.id,
            content: entry.content,
            createdAt: entry.createdAt,
          },
          ...existing,
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update localStorage journal:", e);
      }

      router.push(`/journal/${entry.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-slate-200">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Today&apos;s reflection
      </h1>
      <p className="text-slate-400 mb-8 max-w-xl">
        Take a few minutes to write honestly about how you&apos;re doing.
        There&apos;s no right way — just a gentle check-in for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full min-h-[220px] rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="What stood out about today? What felt heavy or light? What do you want to remember?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {saving ? "Saving…" : "Save reflection"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Stored securely in your Havenly account. Local backup on this device is
        also kept for now.
      </p>
    </div>
  );
}
