"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

export default function JournalEntryPage() {
  const { supabase, session } = useSupabase();
  const params = useParams();
  const router = useRouter();

  const entryId =
    typeof params?.id === "string" ? params.id : undefined;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reflectionDraft, setReflectionDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!supabase || !session?.user || !entryId) return;

    let cancelled = false;

    async function loadEntry() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("journal_entries")
        .select("id,title,content,reflection,created_at,user_id")
        .eq("id", entryId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setEntry(null);
        setError("This entry could not be found.");
        setLoading(false);
        return;
      }

      const normalized: JournalEntry = {
        id: data.id,
        title: data.title ?? null,
        content: data.content,
        reflection: data.reflection ?? null,
        created_at: data.created_at,
      };

      setEntry(normalized);
      setReflectionDraft(normalized.reflection ?? "");
      setLoading(false);
    }

    loadEntry();

    return () => {
      cancelled = true;
    };
  }, [supabase, session, entryId]);

  async function saveReflection() {
    if (!entry) return;

    setSaving(true);
    setError(null);

    const res = await fetch("/api/journal/update-reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: entry.id,
        reflection: reflectionDraft,
      }),
    });

    if (!res.ok) {
      setError("Failed to save reflection.");
      setSaving(false);
      return;
    }

    setEntry({ ...entry, reflection: reflectionDraft });
    setSaving(false);
  }

  async function generateReflection() {
    if (!entry?.content) return;

    setGenerating(true);
    setError(null);

    const res = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: entry.content,
        entryId: entry.id,
      }),
    });

    if (!res.ok) {
      setError("AI reflection failed.");
      setGenerating(false);
      return;
    }

    const json = await res.json();
    const text =
      json?.reflection ??
      json?.data?.reflection ??
      "";

    setReflectionDraft(text);
    setGenerating(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-400">
        Loading entry…
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-rose-400">{error}</p>
        <button
          onClick={() => router.push("/journal")}
          className="mt-4 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
        >
          ← Back to journal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/journal")}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
        >
          ← Back to journal
        </button>
        <span className="text-xs text-slate-500">
          Saved on {new Date(entry.created_at).toLocaleString()}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-slate-100">
            Your entry
          </h2>
          {entry.title && (
            <p className="mt-2 font-medium text-slate-200">
              {entry.title}
            </p>
          )}
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
            {entry.content}
          </p>
        </section>

        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-slate-100">
            AI reflection
          </h2>

          <textarea
            className="mt-3 min-h-[180px] resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100"
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
          />

          <div className="mt-4 flex gap-3">
            <button
              onClick={generateReflection}
              disabled={generating}
              className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60"
            >
              {generating ? "Thinking…" : "Generate AI reflection"}
            </button>

            <button
              onClick={saveReflection}
              disabled={saving}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save reflection"}
            </button>
          </div>

          <Link
            href="/premium"
            className="mt-4 text-[11px] text-slate-500 hover:text-emerald-300"
          >
            Upgrade to unlock deeper reflections →
          </Link>
        </section>
      </div>
    </div>
  );
}
