// app/(protected)/tools/mood/page.tsx
"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";

export default function MoodToolPage() {
  return (
    <RequirePremium>
      <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Premium tool
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Mood trends & gentle check-ins
            </h1>
            <p className="text-sm text-white/70 max-w-2xl">
              This page will evolve into a richer mood-tracking experience:
              simple check-ins, light visual patterns over time, and gentle
              prompts that help you notice how you have really been doing –
              without judgment or pressure.
            </p>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              What you can expect here soon
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Quick mood sliders to capture how you feel in the moment.</li>
              <li>
                Light timelines showing how your mood shifts across days and
                weeks.
              </li>
              <li>
                Soft, supportive reflections that connect mood patterns with
                your journal entries.
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-2">
              The underlying design is focused on clarity and calm. Nothing here
              is about scoring or judging you – only about gently surfacing
              patterns you might want to pay attention to.
            </p>
          </section>

          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-300">
            <p className="mb-2">
              For now, you can continue using your journal as the main place to
              express what is happening day to day.
            </p>
            <p>
              As this mood tool becomes more powerful, it will simply sit on top
              of your existing entries – helping you see things more clearly,
              not asking you to work harder.
            </p>
          </section>

          <footer className="flex items-center justify-between pt-2">
            <Link
              href="/tools"
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              ← Back to Tools
            </Link>
            <Link
              href="/journal"
              className="text-sm text-slate-300 hover:text-white"
            >
              Go to journal
            </Link>
          </footer>
        </div>
      </div>
    </RequirePremium>
  );
}
