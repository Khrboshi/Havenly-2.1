"use client";

import RequirePremium from "@/app/components/RequirePremium";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <RequirePremium>
      <div className="min-h-screen w-full px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6">Tools</h1>

        <p className="text-white/70 mb-8 max-w-xl">
          Explore advanced mental-wellbeing tools powered by AI. These tools
          help you reflect, reduce stress, gain emotional clarity, and improve
          your journaling practice.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/10 p-6 bg-slate-900/50 backdrop-blur">
            <h2 className="text-xl font-semibold mb-2">Reflection Assistant</h2>
            <p className="text-white/70 mb-4">
              Ask deeper questions and unlock new insights about your day.
            </p>
            <Link
              href="/tools/reflection"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Start →
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 p-6 bg-slate-900/50 backdrop-blur">
            <h2 className="text-xl font-semibold mb-2">Mood Breakdown</h2>
            <p className="text-white/70 mb-4">
              Understand emotional patterns across your journal entries.
            </p>
            <Link
              href="/tools/mood"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Explore →
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 p-6 bg-slate-900/50 backdrop-blur">
            <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>
            <p className="text-white/70 mb-4">
              Receive personalized tips to improve your wellbeing.
            </p>
            <Link
              href="/tools/suggestions"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Discover →
            </Link>
          </div>
        </div>
      </div>
    </RequirePremium>
  );
}
