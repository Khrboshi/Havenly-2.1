"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

export default function JournalEntryPage() {
  const { supabase, session } = useSupabase();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const entryId = params?.id;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!entryId || !session?.user) return;

    async function loadEntry() {
      setLoading(true);
      setErrorMsg(null);

      try {
        // ✅ THE ONLY TS-SAFE SUPABASE PATTERN
        const response = await supabase
          .from("journal_entries")
          .select("id,user_id,title,content,reflection,created_at")
          .eq("id", entryId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        const data = response.data as JournalEntry | null;

        if (!data) {
          setErrorMsg("This entry could not be found.");
          setEntry(null);
          return;
        }

        setEntry(data);
        setReflectionDraft(data.reflection ?? "");
      } catch {
        setErrorMsg("Unexpected error loading entry.");
        setEntry(null);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [supabase, session, entryId]);

  async function saveReflection() {
    if (!entry) return;
    setSaving(true);
    setUpgradeMsg(null);

    try {
      const res = await fetch("/api/journal/update-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: entry.id,
          reflection: reflectionDraft,
        }),
      });

      if (res.status === 402) {
        const data = await res.json();
        setUpgradeMsg(data.message || "Upgrade required.");
        return;
      }

      if (!res.ok) throw new Error();

      setEntry({ ...entry, reflection: reflectionDraft });
    } catch {
      setErrorMsg("Could not save reflection.");
    } finally {
      setSaving(false);
    }
  }

  async function generateReflection() {
    if (!entry?.content) return;

    setGenerating(true);
    setUpgradeMsg(null);

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: entry.content,
          entryId: entry.id,
        }),
      });

      if (res.status === 402) {
        const data = await res.json();
        setUpgradeMsg(data.message || "Upgrade required.");
        return;
      }

      if (!res.ok) throw new Error();

      const data = await res.json();
      setReflectionDraft(data.reflection || "");
    } catch {
      setErrorMsg("AI reflection failed.");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-sm text-slate-400">
        Loading entry…
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-sm text-rose-300">
        {errorMsg || "Entry not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <button
        onClick={() => router.push("/journal")}
        className="mb-4 text-xs text-slate-400 hover:text-emerald-300"
      >
        ← Back to journal
      </button>

      <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          {entry.title && (
            <h1 className="mb-3 text-lg font-semibold text-slate-100">
              {entry.title}
            </h1>
          )}
          <p className="whitespace-pre-wrap text-sm text-slate-200">
            {entry.content}
          </p>
        </section>

        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            AI Reflection
          </h2>

          <textarea
            className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100"
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
            placeholder="Generate or write your own reflection…"
          />

          {upgradeMsg && (
            <div className="mt-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-2 text-xs text-amber-200">
              {upgradeMsg}{" "}
              <Link href="/premium" className="underline">
                Upgrade →
              </Link>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={generateReflection}
              disabled={generating}
              className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900"
            >
              {generating ? "Thinking…" : "Generate AI reflection"}
            </button>

            <button
              onClick={saveReflection}
              disabled={saving}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-100"
            >
              {saving ? "Saving…" : "Save reflection"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
