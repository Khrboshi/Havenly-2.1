"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

/* ---------------- TYPES ---------------- */

type JournalRow = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

/* ---------------- PAGE ---------------- */

export default function JournalEntryPage() {
  const { supabase, session } = useSupabase();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const entryId = params?.id;

  const [entry, setEntry] = useState<JournalRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reflectionDraft, setReflectionDraft] = useState("");
  const [savingReflection, setSavingReflection] = useState(false);
  const [generatingReflection, setGeneratingReflection] = useState(false);

  /* ---------------- LOAD ENTRY ---------------- */

  useEffect(() => {
    if (!entryId || !supabase || !session?.user) return;

    async function loadEntry() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const result = await supabase
          .from<JournalRow, JournalRow>("journal_entries")
          .select("id,user_id,title,content,reflection,created_at")
          .eq("id", entryId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (result.error) {
          console.error(result.error);
          setErrorMsg("We couldn’t load this entry.");
          setEntry(null);
        } else if (!result.data) {
          setErrorMsg("This entry could not be found.");
          setEntry(null);
        } else {
          setEntry(result.data);
          setReflectionDraft(result.data.reflection ?? "");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Something went wrong while loading this entry.");
        setEntry(null);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [entryId, supabase, session]);

  /* ---------------- ACTIONS ---------------- */

  async function handleSaveReflection() {
    if (!entryId) return;

    setSavingReflection(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/journal/update-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entryId,
          reflection: reflectionDraft,
        }),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      setEntry((prev) =>
        prev ? { ...prev, reflection: reflectionDraft } : prev
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("We couldn’t save your reflection. Please try again.");
    } finally {
      setSavingReflection(false);
    }
  }

  async function handleGenerateReflection() {
    if (!entry?.content) {
      setErrorMsg("Write something first so we can reflect on it.");
      return;
    }

    setGeneratingReflection(true);
    setErrorMsg(null);

    try {
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
        setErrorMsg(data.message);
        return;
      }

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setReflectionDraft(data.reflection ?? "");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "We couldn’t generate an AI reflection right now. Please try again."
      );
    } finally {
      setGeneratingReflection(false);
    }
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/journal")}
          className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
        >
          ← Back to journal
        </button>

        {entry && (
          <span className="text-xs text-slate-500">
            Saved on{" "}
            <span className="text-slate-300">
              {new Date(entry.created_at).toLocaleString()}
            </span>
          </span>
        )}
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Loading your entry…</p>
      )}

      {!loading && errorMsg && !entry && (
        <p className="text-sm text-rose-300">{errorMsg}</p>
      )}

      {!loading && entry && (
        <div className="grid gap-6 md:grid-cols-[1.4fr,1.1fr]">
          {/* LEFT */}
          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-sm font-semibold text-slate-100">
              Your reflection
            </h2>

            {entry.title && (
              <p className="mt-3 font-semibold text-slate-50">
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
              className="mt-3 min-h-[180px] resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
              placeholder="Ask Havenly to reflect, or write your own notes…"
              value={reflectionDraft}
              onChange={(e) => setReflectionDraft(e.target.value)}
            />

            {errorMsg && (
              <p className="mt-2 text-xs text-rose-300">{errorMsg}</p>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleGenerateReflection}
                disabled={generatingReflection}
                className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-300 disabled:opacity-60"
              >
                {generatingReflection ? "Thinking…" : "Generate AI reflection"}
              </button>

              <button
                onClick={handleSaveReflection}
                disabled={savingReflection}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-100 hover:bg-slate-800 disabled:opacity-60"
              >
                {savingReflection ? "Saving…" : "Save reflection"}
              </button>

              <Link
                href="/premium"
                className="ml-auto hidden text-[11px] text-slate-500 hover:text-emerald-300 md:inline"
              >
                See how Premium deepens your reflections →
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
