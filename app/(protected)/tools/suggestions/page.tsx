// app/(protected)/tools/suggestions/page.tsx
"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";

export default function SuggestionsToolPage() {
  return (
    <RequirePremium>
      <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Premium tool
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Gentle next-step suggestions
            </h1>
            <p className="text-sm text-white/70 max-w-2xl">
              This page will surface calm, realistic suggestions based on your
              entries – small next steps, not big life overhauls. Think of it as
              a quiet companion that occasionally says, “Here are one or two
              things you might try, if you feel up to it.”
            </p>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Future behaviour of this tool
            </h2>
            <p className="text-sm text-slate-300">
              Over time, this tool will learn from your patterns: where you feel
              stuck, what tends to drain you, and what reliably helps. From
              there, it can suggest very small, compassionate steps such as:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>A 5-minute reflection prompt when you feel overwhelmed.</li>
              <li>
                A suggestion to revisit an entry where you sounded strong or
                proud.
              </li>
              <li>
                A reminder to celebrate a tiny win you might otherwise dismiss.
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-2">
              None of this will be framed as “fixing” you. The goal is to offer
              invitations, not instructions.
            </p>
          </section>

          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-300">
            <p>
              For now, you can continue journaling as usual. When this tool is
              live, suggestions will be an optional layer on top of what you are
              already doing – you stay in full control.
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
