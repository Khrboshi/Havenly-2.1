// app/(protected)/tools/reflection/page.tsx
"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";

export default function ReflectionToolPage() {
  return (
    <RequirePremium>
      <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Premium tool
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Deeper weekly reflections
            </h1>
            <p className="text-sm text-white/70 max-w-2xl">
              This space is dedicated to deeper AI reflections on your recent
              entries: themes, repeated worries, small wins, and areas where you
              might want to be a bit kinder with yourself.
            </p>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              How this will work
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
              <li>Havenly scans your recent journal entries (privately).</li>
              <li>
                It identifies patterns, repeated feelings, and moments that
                seem important.
              </li>
              <li>
                It gently mirrors back what really mattered – not as judgment,
                but as companionship and perspective.
              </li>
            </ol>
            <p className="text-xs text-slate-500 mt-2">
              Under the hood this will still be the same respectful, non-pushy
              engine that powers your current reflections – just with more
              context and richer summaries.
            </p>
          </section>

          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-300">
            <p>
              Until this experience is fully wired up, you can continue using
              the existing reflection flow from your journal entries, and know
              that this page will simply extend what already works – not replace
              it.
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
