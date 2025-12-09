"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseSessionProvider";

type CreditsState = {
  planType: string;
  credits: number;
};

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);

  const [entryId, setEntryId] = useState<string | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);

  const [creditsInfo, setCreditsInfo] = useState<CreditsState | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const [saving, setSaving] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Redirect if no session (extra safety; middleware should handle this too) ---
  useEffect(() => {
    if (session === null) {
      router.replace("/magic-login");
    }
  }, [session, router]);

  // --- Load current credits / plan on mount ---
  useEffect(() => {
    let active = true;

    async function loadCredits() {
      try {
        setLoadingCredits(true);
        const res = await fetch("/api/user/credits");
        if (!res.ok) {
          if (!active) return;
          setCreditsInfo(null);
          return;
        }
        const data = await res.json();
        if (!active) return;

        setCreditsInfo({
          planType: data.planType ?? "FREE",
          credits: typeof data.credits === "number" ? data.credits : 0,
        });
      } catch (err) {
        console.error("Failed to load credits:", err);
        if (active) {
          setCreditsInfo(null);
        }
      } finally {
        if (active) setLoadingCredits(false);
      }
    }

    loadCredits();
    return () => {
      active = false;
    };
  }, []);

  const readablePlan =
    creditsInfo?.planType === "PREMIUM"
      ? "Premium"
      : creditsInfo?.planType === "TRIAL"
      ? "Trial"
      : "Free";

  const isPremium =
    creditsInfo?.planType === "PREMIUM" || creditsInfo?.planType === "TRIAL";

  // --- Helper: ensure we have an entry row in journal_entries and return its id ---
  async function ensureEntryExists(): Promise<string | null> {
    if (!session?.user) {
      setError("You need to be logged in to save a reflection.");
      return null;
    }

    if (entryId) {
      return entryId;
    }

    if (!content.trim()) {
      setError("Write at least a few sentences before saving.");
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("journal_entries")
        .insert([
          {
            user_id: session.user.id,
            title: title.trim() !== "" ? title.trim() : null,
            content: content.trim(),
          },
        ])
        .select("id")
        .single();

      if (insertError || !data) {
        console.error("Error inserting journal entry:", insertError);
        setError("Could not save your entry. Please try again.");
        return null;
      }

      setEntryId(data.id);
      return data.id;
    } catch (err) {
      console.error("Unexpected error while inserting entry:", err);
      setError("Could not save your entry. Please try again.");
      return null;
    }
  }

  // --- Save only (no AI reflection) ---
  async function handleSaveOnly() {
    setError(null);
    setSaving(true);

    try {
      const id = await ensureEntryExists();
      if (!id) return;

      // Optional: if user edits after first save, update content/title
      if (entryId) {
        const { error: updateError } = await supabase
          .from("journal_entries")
          .update({
            title: title.trim() !== "" ? title.trim() : null,
            content: content.trim(),
          })
          .eq("id", entryId);

        if (updateError) {
          console.error("Error updating entry:", updateError);
        }
      }

      router.push(`/journal/${id}`);
    } finally {
      setSaving(false);
    }
  }

  // --- Save + AI Reflection (uses credits + /api/reflect) ---
  async function handleSaveAndReflect() {
    setError(null);
    setReflecting(true);
    setReflection(null);

    try {
      const id = await ensureEntryExists();
      if (!id) return;

      // 1) Deduct credits first
      try {
        const creditRes = await fetch("/api/user/credits/use", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 1,
            feature: "AI_REFLECTION",
            description: "AI reflection for journal entry",
          }),
        });

        const creditData = await creditRes.json();

        if (!creditRes.ok || creditData?.success !== true) {
          const msg =
            creditData?.error ||
            "You do not have enough credits for an AI reflection.";
          setError(msg);
          return;
        }

        if (typeof creditData.credits === "number" && creditsInfo) {
          setCreditsInfo({
            ...creditsInfo,
            credits: creditData.credits,
          });
        }
      } catch (err) {
        console.error("Error using credits:", err);
        setError(
          "Could not verify your credits. Please try again or contact support."
        );
        return;
      }

      // 2) Call /api/reflect to generate AI response
      try {
        const reflectRes = await fetch("/api/reflect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entryId: id,
            content: content.trim(),
            mood,
          }),
        });

        const data = await reflectRes.json();

        if (!reflectRes.ok) {
          const msg =
            data?.error ||
            "Reflection service is currently unavailable. Your entry is saved.";
          setError(msg);
          return;
        }

        if (data?.reflection) {
          setReflection(data.reflection);
        } else {
          setError(
            "Your entry was saved, but the AI reflection could not be generated."
          );
        }
      } catch (err) {
        console.error("Error calling /api/reflect:", err);
        setError(
          "Your entry was saved, but the AI reflection could not be generated."
        );
      }
    } finally {
      setReflecting(false);
    }
  }

  const disableActions =
    saving || reflecting || !session?.user || !content.trim();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col gap-8 py-6 md:py-10">
      {/* HEADER */}
      <header className="flex flex-col gap-3 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 md:text-3xl">
            New reflection
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Capture what is on your mind. You can keep it private or ask
            Havenly for a gentle reflection.
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 text-xs md:items-end">
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] font-medium text-slate-200">
            {loadingCredits
              ? "Checking plan…"
              : `${readablePlan} plan · ${
                  creditsInfo?.credits ?? 0
                } credits left`}
          </span>
          {!isPremium && (
            <span className="text-[11px] text-slate-500">
              Free users get a limited number of AI reflections per month.
            </span>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Title + mood row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="Give this reflection a short name"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mt-3 w-full md:mt-0 md:w-56">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
              How are you arriving?
            </span>
            <div className="flex flex-wrap gap-2">
              {["Calm", "Overwhelmed", "Tired", "Hopeful", "Anxious"].map(
                (label) => {
                  const selected = mood === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setMood(selected ? null : label)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        selected
                          ? "bg-emerald-400 text-slate-950"
                          : "border border-slate-700 bg-slate-950 text-slate-300 hover:border-emerald-400 hover:text-emerald-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Main textarea */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
            What&apos;s on your mind?
          </label>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80">
            <textarea
              className="h-56 w-full resize-none rounded-2xl border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none ring-0 placeholder:text-slate-500 md:h-72"
              placeholder="You can start wherever you are: what happened, what you’re worried about, what you’re avoiding, or what went well today..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Havenly is private. You can always edit or delete this later.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-500/70 bg-red-950/40 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={saving || reflecting || !content.trim()}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-medium text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
            >
              {saving ? "Saving…" : "Save only"}
            </button>

            <button
              type="button"
              onClick={handleSaveAndReflect}
              disabled={disableActions}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-900 disabled:text-emerald-200"
            >
              {reflecting ? "Asking Havenly…" : "Save + AI reflection"}
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Using AI reflection will consume{" "}
            <span className="font-medium text-slate-200">1 credit</span>. No
            pressure to use it every time.
          </div>
        </div>

        {/* AI REFLECTION PANEL */}
        {reflection && (
          <section className="mt-4 rounded-2xl border border-emerald-500/40 bg-slate-950/80 p-4">
            <h2 className="mb-2 text-sm font-semibold text-emerald-300">
              Havenly&apos;s reflection
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
              {reflection}
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {entryId && (
                <button
                  type="button"
                  onClick={() => router.push(`/journal/${entryId}`)}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-400/10"
                >
                  Open full entry
                </button>
              )}
              <button
                type="button"
                onClick={() => setReflection(null)}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Hide reflection
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
