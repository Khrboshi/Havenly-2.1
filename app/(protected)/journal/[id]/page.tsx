"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string | null;
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

  const [savingReflection, setSavingReflection] = useState(false);
  const [generatingReflection, setGeneratingReflection] = useState(false);

  const [reflectionDraft, setReflectionDraft] = useState("");

  useEffect(() => {
    if (!entryId || !supabase) return;

    async function loadEntry() {
      setLoading(true);
      setErrorMsg(null);

      try {
        // Cast to avoid TS generic/arg mismatch – runtime stays correct
        const { data, error } = (await supabase
          .from("journal_entries")
          .select("*")
          .eq("id", entryId)
          .eq("user_id", session?.user?.id ?? "")
          .maybeSingle()) as { data: any; error: any };

        if (error) {
          console.error("Error loading journal entry:", error);
          setErrorMsg("We couldn’t load this entry. Please try again.");
          setEntry(null);
        } else if (!data) {
          setErrorMsg("This entry could not be found.");
          setEntry(null);
        } else {
          const normalized: JournalEntry = {
            id: data.id,
            title: data.title ?? null,
            content: data.content ?? null,
            reflection: data.reflection ?? null,
            created_at: data.created_at,
          };
          setEntry(normalized);
          setReflectionDraft(normalized.reflection ?? "");
        }
      } catch (err) {
        console.error("Unexpected load error:", err);
        setErrorMsg("Something went wrong while loading your entry.");
        setEntry(null);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [supabase, session, entryId]);

  async function handleSaveReflection() {
    if (!entryId) return;
    setSavingReflection(true);
    setErrorMsg(null);

    try {
      // Uses your existing update-reflection API
      const res = await fetch("/api/journal/update-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entryId,
          reflection: reflectionDraft,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save reflection");
      }

      setEntry((prev) =>
        prev ? { ...prev, reflection: reflectionDraft } : prev
      );
    } catch (err) {
      console.error("Error saving reflection:", err);
      setErrorMsg("We couldn’t save your reflection. Please try again.");
    } finally {
      setSavingReflection(false);
    }
  }

  async function handleGenerateReflection() {
    if (!entry || !entry.content) {
      setErrorMsg("Write something first so we can reflect on it.");
      return;
    }

    setGeneratingReflection(true);
    setErrorMsg(null);

    try {
      // Uses your existing /api/reflect endpoint
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: entry.content,
          entryId: entry.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Reflection request failed");
      }

      const data = await res.json();

      const aiText =
        data?.reflection ??
        data?.data?.reflection ??
        "We couldn’t generate a reflection right now. Please try again later.";

      setReflectionDraft(aiText);

      // Optionally persist immediately if your API already handled saving
      // but we keep local state and let the user press "Save reflection".
    } catch (err) {
      console.error("Error generating reflection:", err);
      setErrorMsg(
        "We couldn’t generate an AI reflection right now. Please try again."
      );
    } finally {
      setGeneratingReflection(false);
    }
  }

  function handleBack() {
    router.push("/journal");
  }

  // ---------- RENDER ----------

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:py-10">
      {/* Top bar: back + meta */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          ← Back to journal
        </button>

        {entry && (
          <p className="text-xs text-slate-500">
            Saved on{" "}
            <span className="font-medium text-slate-300">
              {new Date(entry.created_at).toLocaleString()}
            </span>
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[1.4fr,1.1fr]">
        {/* LEFT: ORIGINAL ENTRY */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h1 className="text-sm font-semibold text-slate-100">
            Your reflection
          </h1>

          {loading && (
            <p className="mt-4 text-sm text-slate-400">
              Loading your entry…
            </p>
          )}

          {!loading && errorMsg && !entry && (
            <p className="mt-4 text-sm text-rose-300">{errorMsg}</p>
          )}

          {!loading && entry && (
            <>
              {entry.title && (
                <p className="mt-3 text-base font-semibold text-slate-50">
                  {entry.title}
                </p>
              )}

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                {entry.content}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                This text stays private. AI reflections are only used to help
                you see patterns — not to advertise to you.
              </p>
            </>
          )}
        </section>

        {/* RIGHT: AI REFLECTION PANEL */}
        <section className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              AI reflection
            </h2>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              Gentle, non-judgmental
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Havenly highlights what felt heavy, what helped, and small things
            you might want to remember. You’re always in control — edit anything
            before saving.
          </p>

          <textarea
            className="mt-4 min-h-[180px] flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder={
              generatingReflection
                ? "Generating a reflection for you…"
                : "Ask Havenly to draft a gentle reflection, or write your own notes here."
            }
            value={reflectionDraft}
            onChange={(e) => setReflectionDraft(e.target.value)}
          />

          {errorMsg && entry && (
            <p className="mt-2 text-xs text-rose-300">{errorMsg}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateReflection}
              disabled={generatingReflection || loading || !entry}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generatingReflection ? "Thinking…" : "Generate AI reflection"}
            </button>

            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={savingReflection || loading || !entry}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}
