"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

/* -----------------------------
   Types
----------------------------- */

type JournalRow = {
  id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

type JournalEntry = JournalRow;

/* -----------------------------
   Page
----------------------------- */

export default function JournalEntryPage() {
  const { supabase, session } = useSupabase();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const entryId = params?.id;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  /* -----------------------------
     Load entry
  ----------------------------- */
  useEffect(() => {
    if (!entryId || !supabase || !session?.user) return;

    async function loadEntry() {
      setLoading(true);
      setError(null);

      const result = await supabase
        .from<JournalRow>("journal_entries")
        .select("id,title,content,reflection,created_at")
        .eq("id", entryId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (result.error || !result.data) {
        setError("This entry could not be loaded.");
        setEntry(null);
      } else {
        setEntry(result.data);
        setReflectionDraft(result.data.reflection ?? "");
      }

      setLoading(false);
    }

    loadEntry();
  }, [entryId, supabase, session]);

  /* -----------------------------
     Save reflection
  ----------------------------- */
  async function handleSaveReflection() {
    if (!entryId) return;

    setSaving(true);
    setError(null);
    setUpgradeMessage(null);

    const res = await fetch("/api/journal/update-reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId,
        reflection: reflectionDraft,
      }),
    });

    if (res.status === 402) {
      const data = await res.json();
      setUpgradeMessage(data.message);
      setSaving(false);
      return;
    }

    if (!res.ok) {
      setError("Could not save reflection.");
      setSaving(false);
      return;
    }

    setEntry((prev) =>
      prev ? { ...prev, reflection: reflectionDraft } : prev
    );

    setSaving(false);
  }

  /* -----------------------------
     Generate AI reflection
  ----------------------------- */
  async function handleGenerateReflection() {
    if (!entry) return;

    setGenerating(true);
    setError(null);
    setUpgradeMessage(null);

    const res = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId: entry.id,
        content: entry.content,
      }),
    });

    if (res.status === 402) {
      const data = await res.json();
      setUpgradeMessage(data.message);
      setGenerating(false);
      return;
    }

    if (!res.ok) {
      setError("AI reflection failed.");
      setGenerating(false);
      return;
    }

    const data = await res.json();
    setReflectionDraft(data.reflection ?? "");
    setGenerating(false);
  }

  /* -----------------------------
     Render
  ----------------------------- */

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-400">
        Loading entry…
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-rose-300">
        {error ?? "Entry not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <button
        onClick={() => router.push("/journal")}
        className="w-fit rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
      >
        ← Back to journal
      </button>

      <div className="grid gap-6 md:grid-cols-[1.4fr,1.1fr]">
        {/* LEFT */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h1 className="text-sm font-semibold text-slate-100">
            Your reflection
          </h1>

          {entry.title && (
            <p className="mt-3 text-base font-semibold text-slate-50">
              {entry.title}
            </p>
          )}

          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
            {entry.content}
          </p>

          <p className="mt-4 text-xs text-slate-500">
            This text stays private. AI reflections are used only to help you see
            patterns — never for advertising.
          </p>
        </section>

        {/* RIGHT */}
        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              AI reflection
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
              Gentle, non-judgmental
            </span>
          </div>

          <textarea
            className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
            placeholder="Ask Havenly to reflect, or write your own notes…"
          />

          {error && (
            <p className="mt-2 text-xs text-rose-300">{error}</p>
          )}

          {upgradeMessage && (
            <p className="mt-2 text-xs text-amber-300">
              {upgradeMessage}{" "}
              <Link href="/premium" className="underline">
                Upgrade →
              </Link>
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleGenerateReflection}
              disabled={generating}
              className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60"
            >
              {generating ? "Thinking…" : "Generate AI reflection"}
            </button>

            <button
              onClick={handleSaveReflection}
              disabled={saving}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-100 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save reflection"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
