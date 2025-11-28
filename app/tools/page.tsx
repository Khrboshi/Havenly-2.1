// app/tools/page.tsx
export default function ToolsPage() {
  return (
    <div className="px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hvn-accent-blue">
            Havenly tools
          </p>
          <h1 className="text-3xl font-semibold text-hvn-text-primary sm:text-4xl">
            Quick prompts and calming exercises for heavy days.
          </h1>
          <p className="max-w-2xl text-sm text-hvn-text-muted sm:text-base">
            These tools are simple starters you can use when you are not sure
            what to write. Each one is designed to take just a few minutes and
            work well with Havenly&apos;s daily reflections.
          </p>
        </header>

        <div className="space-y-4">
          <ToolCard
            title="1 — Gentle check-in"
            description="When you don't know what to write, use this as a soft starting point."
            bullets={[
              "What is one thing you are feeling right now?",
              "Where do you notice that feeling in your body?",
              "What would feel just 5% kinder to yourself in this moment?",
            ]}
          />

          <ToolCard
            title="2 — Breathing reset"
            description="Use this when your day feels too fast or crowded."
            bullets={[
              "Take 5 slow breaths—in for 4, out for 6.",
              "On each exhale, quietly name one thing you can let go of.",
              "Afterward, write one sentence about what shifted, even slightly.",
            ]}
          />

          <ToolCard
            title="3 — Reframing a worry"
            description="For moments when one thought keeps looping in your mind."
            bullets={[
              "Write down the worry in one clear sentence.",
              'Then write: “If a close friend told me this, what would I gently say back to them?”',
              "Let that kinder response be the last sentence you write.",
            ]}
          />
        </div>

        <section className="rounded-2xl border border-hvn-card bg-hvn-accent-mint-soft/10 p-5 text-sm text-hvn-text-secondary shadow-sm shadow-black/40">
          <p className="font-medium text-hvn-accent-mint">
            Coming soon: AI-assisted tools
          </p>
          <p className="mt-2">
            Havenly Plus will be able to suggest tailored prompts and calming
            exercises based on your recent reflections—always with your privacy
            and boundaries at the center.
          </p>
        </section>
      </div>
    </div>
  );
}

type ToolCardProps = {
  title: string;
  description: string;
  bullets: string[];
};

function ToolCard({ title, description, bullets }: ToolCardProps) {
  return (
    <article className="rounded-2xl border border-hvn-card bg-hvn-bg-elevated/85 p-5 shadow-sm shadow-black/50">
      <h2 className="text-sm font-semibold text-hvn-text-secondary sm:text-base">
        {title}
      </h2>
      <p className="mt-2 text-sm text-hvn-text-muted">{description}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-hvn-text-muted">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </article>
  );
}
