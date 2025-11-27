"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Reflection = {
  id: string;
  createdAt: string;
  content: string;
};

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  function loadEntries(): Reflection[] {
    try {
      const stored = localStorage.getItem("havenly_journal_entries");
      if (!stored) return [];
      return JSON.parse(stored) as Reflection[];
    } catch {
      return [];
    }
  }

  function saveEntries(entries: Reflection[]) {
    localStorage.setItem("havenly_journal_entries", JSON.stringify(entries));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSaving(true);

    const newEntry: Reflection = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      content: text.trim(),
    };

    const all = loadEntries();
    all.push(newEntry);
    saveEntries(all);

    setSaving(false);
    router.push("/journal");
  }

  return (
    <div className="max-w-3xl mx-auto pt-32 pb-24 px-6 text-slate-200">
      <h1 className="text-3xl font-semibold mb-3">Today&apos;s reflection</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Take a few minutes to write honestly about how you&apos;re doing. There&apos;s
        no right way to do this — just a gentle check-in with yourself.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          className="w-full min-h-[220px] rounded-xl bg-slate-900/70 border border-slate-800 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition resize-vertical"
          placeholder="What stood out about today? What felt heavy, or surprisingly light? What do you want to remember about how you felt?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={saving || !text.trim()}
            className="bg-emerald-400 disabled:bg-emerald-400/60 disabled:cursor-not-allowed text-slate-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-300 transition"
          >
            {saving ? "Saving..." : "Save reflection"}
          </button>

          <p className="text-xs text-slate-500">
            Stored locally in this browser. Premium cloud backup coming soon.
          </p>
        </div>
      </form>
    </div>
  );
}
