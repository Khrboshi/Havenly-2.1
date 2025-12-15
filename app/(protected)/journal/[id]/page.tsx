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
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const entryId = params?.id;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reflectionDraft, setReflectionDraft] = useState("");
  const [savingReflection, setSavingReflection] = useState(false);
  const [generatingReflection, setGeneratingReflection] = useState(false);

  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  /* -------------------------------------------------------
     Load journal entry (TYPE SAFE)
  ------------------------------------------------------- */
  useEffect(() => {
    if (!entryId || !supabase || !session?.user) return;

    async function loadEntry() {
      setLoading(true);
      setErrorMsg(null);

      const {
        data,
        error,
      }: { data: JournalEntry | null; error: any } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", entryId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error || !data) {
        setErrorMsg("This journal entry could not be found.");
        setEntry(null);
      } else {
        setEntry(data);
        setReflectionDraft(data.reflection ?? "");
      }

      setLoading(false);
    }

    loadEntry();
  }, [entryId, supabase, session]);

  /* -------------------------------------------------------
     Save reflection (monetized)
  ------------------------------------------------------- */
  async function handleSaveReflection() {
    if (!entryId) return;

    setSavingReflection(true);
    setErrorMsg(null);
    setUpgradeMessage(null);

    try {
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
        return;
      }

      if (!res.ok) {
        throw new Error("Save failed");
      }

      setEntry((prev) =>
        prev ? { ...prev, reflection: reflectionDraft } : prev
      );
    } catch {
      setErrorMsg("We couldn’t save your reflection. Please try again.");
    } finally {
      setSavingReflection(false);
    }
  }

  /* -------------------------------------------------------
     Generate AI reflection (monetized)
  ------------------------------------------------------- */
  async function handleGenerateReflection() {
    if (!entry?.content) {
      setErrorMsg("Write something first so we can reflect on it.");
      return;
    }

    setGeneratingReflection(true);
    setErrorMsg(null);
    setUpgradeMessage(null);

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
        setUpgradeMessage(data.message);
        return;
      }

      if (!res.ok) {
        throw new Error("AI reflection failed");
      }

      const data = await res.json();
      setReflectionDraft(data.reflection);
    } catch {
      setErrorMsg("AI reflection is unavailable right now.");
    } finally {
      setGeneratingReflection(false);
    }
  }

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/journal")}
          className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
        >
          ← Back to journal
        </button>

        {entry && (
          <span className="text-xs text-slate-500">
            Saved on {new Date(entry.created_at).toLocaleString()}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        {/* LEFT */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h1 className="text-sm font-semibold text-slate-100">
            Your reflection
          </h1>

          {loading && (
            <p className="mt-4 text-sm text-slate-400">Loading entry…</p>
          )}

          {!loading && errorMsg && (
            <p className="mt-4 text-sm text-rose-300">{errorMsg}</p>
          )}

          {!loading && entry && (
            <>
              {entry.title && (
                <p className="mt-3 text-base font-semibold text-slate-50">
                  {entry.title}
                </p>
              )}

              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
                {entry.content}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                This text stays private. AI reflections are used only to help you
                see patterns — never for advertising.
              </p>
            </>
          )}
        </section>

        {/* RIGHT */}
        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              AI reflection
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
              Gentle, non-judgmental
            </span>
          </div>

          <textarea
            className="mt-3 min-h-[180px] flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
          />

          {upgradeMessage && (
            <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
              <p className="text-xs text-emerald-300">{upgradeMessage}</p>
              <Link
                href="/premium"
                className="mt-2 inline-block rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900"
              >
                Upgrade to Premium
              </Link>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleGenerateReflection}
              disabled={generatingReflection}
              className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900"
            >
              {generatingReflection ? "Thinking…" : "Generate AI reflection"}
            </button>

            <button
              onClick={handleSaveReflection}
              disabled={savingReflection}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-100"
            >
              {savingReflection ? "Saving…" : "Save reflection"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
