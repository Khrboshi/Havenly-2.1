// app/(protected)/tools/page.tsx
"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <RequirePremium>
      <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Tools</h1>
          <p className="text-white/70 mb-8 max-w-2xl">
            Explore advanced wellbeing tools designed to help you reflect,
            reduce stress, and see your emotional patterns more clearly. These
            tools are part of{" "}
            <span className="font-medium text-emerald-300">
              Havenly Premium
            </span>
            .
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 p-6 bg-slate-900/60 backdrop-blur">
              <h2 className="text-lg font-semibold mb-2">
                Reflection Assistant
              </h2>
              <p className="text-white/70 mb-4 text-sm">
                Ask deeper questions and unlock new insights about your day.
              </p>
              <Link
                href="/tools/reflection"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Start →
              </Link>
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-slate-900/60 backdrop-blur">
              <h2 className="text-lg font-semibold mb-2">Mood Breakdown</h2>
              <p className="text-white/70 mb-4 text-sm">
                Understand emotional patterns across your journal entries.
              </p>
              <Link
                href="/tools/mood"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Explore →
              </Link>
            </div>

            <div className="rounded-xl border border-white/10 p-6 bg-slate-900/60 backdrop-blur">
              <h2 className="text-lg font-semibold mb-2">AI Suggestions</h2>
              <p className="text-white/70 mb-4 text-sm">
                Receive gentle, practical suggestions to support your
                wellbeing.
              </p>
              <Link
                href="/tools/suggestions"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Discover →
              </Link>
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Prefer to stay with journaling only? You can always continue using
            the{" "}
            <Link href="/journal" className="text-emerald-300 hover:text-emerald-200">
              free journal
            </Link>{" "}
            without upgrading.
          </p>
        </div>
      </div>
    </RequirePremium>
  );
}
