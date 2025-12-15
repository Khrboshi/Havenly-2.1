"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useUserPlan } from "@/app/components/useUserPlan";
import UpgradeTriggerModal from "@/app/components/UpgradeTriggerModal";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
};

type Reflection = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

export default function JournalEntryClient({ entry }: { entry: JournalEntry }) {
  const { planType, credits, renewalDate, loading, refresh } = useUserPlan();

  const isPremium = planType === "PREMIUM";

  const [busy, setBusy] = useState(false);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const readablePlan = useMemo(() => {
    if (planType === "PREMIUM") return "Premium";
    if (planType === "TRIAL") return "Trial";
    return "Free";
  }, [planType]);

  async function generateReflection() {
    setError(null);

    // Upgrade trigger at the moment of intent
    if (!isPremium && !loading && credits <= 0) {
      setShowUpgrade(true);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/ai/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: entry.id,
          content: entry.content,
          title: entry.title || "",
        }),
      });

      if (res.status === 402) {
        setShowUpgrade(true);
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "We couldn't generate a reflection right now.");
        return;
      }

      const j = await res.json();
      setReflection(j?.reflection || null);

      // refresh credits after consumption
      await refresh();
    } catch {
      setError("We couldn't generate a reflection right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10 text-white">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{entry.title || "Untitled"}</h1>
          <p className="mt-1 text-xs text-white/50">
            {new Date(entry.created_at).toLocaleString()}
          </p>
        </div>

        <Link href="/journal" className="text-sm text-emerald-400 hover:underline">
          ← Back to journal
        </Link>
      </header>

      <article className="whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900/60 p-6 leading-relaxed">
        {entry.content}
      </article>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">AI Reflection</h2>
            <p className="mt-1 text-sm text-white/70">
              Plan: <span className="text-emerald-300">{readablePlan}</span>
              {!isPremium ? (
                <>
                  {" "}
                  · Reflections left:{" "}
                  <span className="text-emerald-300">{loading ? "…" : credits}</span>
                  {renewalDate ? (
                    <span className="text-white/50"> (renews {renewalDate})</span>
                  ) : null}
                </>
              ) : (
                <span className="text-white/50"> · Unlimited</span>
              )}
            </p>
          </div>

          <button
            onClick={generateReflection}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {busy ? "Generating…" : "Generate Reflection"}
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        {!reflection ? (
          <p className="mt-4 text-sm text-white/60">
            When you’re ready, Havenly will reflect back themes, emotions, and a gentle next step.
          </p>
        ) : (
          <div className="mt-5 space-y-4 text-sm text-white/80">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-white/90">{reflection.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Themes
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {reflection.themes?.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Emotions
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {reflection.emotions?.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Gentle next step
              </h3>
              <p className="mt-2">{reflection.gentle_next_step}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Two questions
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {reflection.questions?.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <UpgradeTriggerModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="You’ve reached your reflection limit"
        message="Upgrade to Premium for unlimited reflections and deeper insights when you need them most."
        source="reflection_limit"
        ctaHref="/upgrade"
        ctaLabel="Upgrade to Premium"
      />
    </div>
  );
}
