import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Gentle prompts and calming exercises",
  description:
    "Simple prompts and calming exercises to help you slow down, breathe, and check in with yourself — even on busy days.",
};

const CARD_BASE =
  "rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-5 sm:px-6 sm:py-6 shadow-sm";

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-300 uppercase">
          Tools
        </p>

        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Quick prompts and calming exercises{" "}
          <span className="block text-emerald-200">
            to support your day.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
          These tools are meant to take just a few minutes. Pick one that fits
          how you are feeling right now — they are gentle starting points, not
          homework.
        </p>

        <div className="mt-10 space-y-5">
          {/* Tool 1 */}
          <article className={CARD_BASE}>
            <h2 className="text-sm font-semibold text-slate-50">
              1 — Gentle check-in
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Use this when you do not know what to write and just need a simple
              way to begin.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              <li>• What is one thing you are feeling right now?</li>
              <li>• Where do you notice that feeling in your body?</li>
              <li>
                • What would feel just 5% kinder to yourself in this moment?
              </li>
            </ul>
          </article>

          {/* Tool 2 */}
          <article className={CARD_BASE}>
            <h2 className="text-sm font-semibold text-slate-50">
              2 — Breathing reset
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              For the days that feel too fast or crowded. Use it before or after
              you write.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              <li>• Take 5 slow breaths — in for 4, out for 6.</li>
              <li>• On each exhale, name one thing you can let go of.</li>
              <li>
                • Afterwards, write one sentence about what shifted, even
                slightly.
              </li>
            </ul>
          </article>

          {/* Tool 3 */}
          <article className={CARD_BASE}>
            <h2 className="text-sm font-semibold text-slate-50">
              3 — Reframing a worry
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              For the moments when one worry keeps looping in your mind.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              <li>• Write the worry in one clear sentence.</li>
              <li>
                • Then write: “If a close friend told me this, what would I
                gently say back?”
              </li>
              <li>
                • Let that kinder response be the last sentence you write for
                now.
              </li>
            </ul>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-700/40 bg-emerald-500/5 px-5 py-4 text-xs text-emerald-100">
          Coming soon: AI-assisted tools that generate personalized prompts and
          calming exercises based on your recent reflections. These will be part
          of Havenly Plus.
        </div>
      </section>
    </main>
  );
}
