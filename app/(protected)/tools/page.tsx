// app/(protected)/tools/page.tsx

export default function ToolsPage() {
  return (
    <main className="min-h-screen px-6 pb-16 pt-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-slate-50 mb-3">
            Tools
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Quick prompts and calming exercises to support your day. Start with
            something small — these are meant to take just a few minutes.
          </p>
        </header>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold text-slate-50 mb-2">
              1 — Gentle check-in
            </h2>
            <p className="text-slate-300 mb-3">
              When you do not know what to write, use this as a simple starter.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-slate-300 text-sm">
              <li>What is one thing you are feeling right now?</li>
              <li>Where do you notice that feeling in your body?</li>
              <li>What would feel just 5% kinder to yourself in this moment?</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold text-slate-50 mb-2">
              2 — Breathing reset
            </h2>
            <p className="text-slate-300 mb-3">
              Use this when your day feels too fast or crowded.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-slate-300 text-sm">
              <li>Take 5 slow breaths — in for 4, out for 6.</li>
              <li>On each exhale, quietly name one thing you can let go of.</li>
              <li>Afterward, write one sentence about what shifted, even slightly.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold text-slate-50 mb-2">
              3 — Reframing a worry
            </h2>
            <p className="text-slate-300 mb-3">
              For moments when one worry keeps looping in your mind.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-slate-300 text-sm">
              <li>Write down the worry in one clear sentence.</li>
              <li>
                Then write: “If a close friend told me this, what would I gently
                say back to them?”
              </li>
              <li>Let that kinder response be the last sentence you write.</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-2xl border border-emerald-700/60 bg-emerald-900/10 p-4">
            <p className="text-sm text-emerald-200">
              <span className="font-semibold">Coming soon:</span> AI-assisted
              Tools+ that can generate personalised prompts and calming
              exercises based on your recent reflections. These will be part of
              Havenly Plus.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
