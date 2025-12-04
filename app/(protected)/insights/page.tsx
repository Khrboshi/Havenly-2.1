// app/(protected)/insights/page.tsx
"use client";

import RequirePremium from "@/app/components/RequirePremium";

export default function InsightsPage() {
  return (
    <RequirePremium>
      <div className="min-h-screen w-full px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6">Insights</h1>

        <p className="text-white/70 mb-8 max-w-xl">
          Here are your personalized journaling insights, emotional patterns,
          and AI-generated reflections. These insights help you understand
          growth, recurring themes, and opportunities for emotional clarity.
        </p>

        <div className="rounded-xl border border-white/10 p-6 bg-slate-900/50 backdrop-blur">
          <p className="text-white/80">
            Premium insights content will appear here once your journaling
            entries are processed. Keep writing consistently to unlock deeper
            analysis.
          </p>
        </div>
      </div>
    </RequirePremium>
  );
}
