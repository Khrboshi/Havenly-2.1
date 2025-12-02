"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

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

function saveLocalEntries(entries: Reflection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const content = text.trim();
    if (!content) return;

    setSaving(true);

    // Generate entry object
    const newEntry: Reflection = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      content,
    };

    const existing = loadLocalEntries();
    existing.push(newEntry);
    saveLocalEntries(existing);

    setSaving(false);

    // Go back to journal
    router.push("/journal");
  }

  return (
    <div className="max-w-3xl mx-auto pt-32 pb-24 px-6 text-slate-200">
      <h1 className="text-3xl font-semibold mb-3">Today&apos;s reflection</h1>

      <p className="text-slate-400 mb-8 text-sm">
        Take a few minutes to write honestly about how you're doing.
        There's no right way — this is a gentle check-in just for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What stood out about today? What felt heavy or light? What do you want to remember?"
          className="
            w-full min-h-[220px] rounded-xl bg-slate-900/70
            border border-slate-800 px-4 py-3 text-sm
            text-slate-200 placeholder:text-slate-500
            focus:outline-none focus:border-emerald-400
            focus:ring-1 focus:ring-emerald-400
            transition resize-vertical
          "
        />

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={saving || !text.trim()}
            className="
              bg-emerald-400 disabled:bg-emerald-400/60
              disabled:cursor-not-allowed text-slate-900
              px-6 py-2.5 rounded-full text-sm font-semibold
              hover:bg-emerald-300 transition
            "
          >
            {saving ? "Saving..." : "Save reflection"}
          </button>

          <p className="text-xs text-slate-500">
            Stored locally on this device.  
            Cloud sync coming in the premium version.
          </p>
        </div>
      </form>
    </div>
  );
}
