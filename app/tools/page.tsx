export const dynamic = "force-static";

export default function ToolsPage() {
  return (
    <main className="space-y-16">

      <section className="pt-10">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--brand-primary-light)]">
          HAVENLY TOOLS
        </h2>

        <h1 className="mt-4 text-4xl font-bold leading-snug">
          Gentle prompts and small{" "}
          <span className="text-[var(--brand-primary)]">reset tools</span> for your day.
        </h1>

        <p className="mt-6 text-lg text-[var(--brand-text)]/80 max-w-3xl">
          These quick exercises are designed to help you slow down, check in, breathe,
          and move forward with a calmer mind. They take only a few minutes.
        </p>
      </section>

      <section className="grid gap-8">
        <div className="p-6 rounded-xl bg-[var(--brand-surface)]/60 border border-white/10 shadow-sm">
          <h3 className="text-xl font-semibold">1 — Gentle check-in</h3>
          <p className="mt-2 text-[var(--brand-text)]/75">
            When you don’t know what to write, start here.
          </p>
          <ul className="mt-4 text-[var(--brand-text)]/75 space-y-2">
            <li>• What is one thing you are feeling right now?</li>
            <li>• Where do you notice that feeling in your body?</li>
            <li>• What would feel 5% kinder to yourself right now?</li>
          </ul>
        </div>

        <div className="p-6 rounded-xl bg-[var(--brand-surface)]/60 border border-white/10 shadow-sm">
          <h3 className="text-xl font-semibold">2 — Breathing reset</h3>
          <p className="mt-2 text-[var(--brand-text)]/75">
            Use this when your day feels fast or crowded.
          </p>
          <ul className="mt-4 text-[var(--brand-text)]/75 space-y-2">
            <li>• Take 5 slow breaths — in for 4, out for 6.</li>
            <li>• On each exhale, name one thing you can let go of.</li>
            <li>• Then write one sentence about what shifted.</li>
          </ul>
        </div>

        <div className="p-6 rounded-xl bg-[var(--brand-surface)]/60 border border-white/10 shadow-sm">
          <h3 className="text-xl font-semibold">3 — Reframing a worry</h3>
          <p className="mt-2 text-[var(--brand-text)]/75">
            For moments when one thought keeps looping.
          </p>
          <ul className="mt-4 text-[var(--brand-text)]/75 space-y-2">
            <li>• Write the worry in one clear sentence.</li>
            <li>• Then write: “If a close friend said this to me, what would I gently say back?”</li>
            <li>• Let that kinder response be your final sentence.</li>
          </ul>
        </div>
      </section>

      <section className="pb-20">
        <div className="p-6 rounded-xl border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5">
          <p className="text-[var(--brand-primary-light)] font-medium">
            Coming soon:
          </p>
          <p className="text-[var(--brand-text)]/75">
            AI-assisted Tools+ that generate personalised prompts and calming exercises
            based on your recent reflections. These will be part of Havenly Plus.
          </p>
        </div>
      </section>

    </main>
  );
}
