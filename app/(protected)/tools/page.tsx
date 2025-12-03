// app/tools/page.tsx

type PlanTier = "FREE" | "ESSENTIAL" | "PREMIUM" | "CREDITS";

type ToolCardProps = {
  title: string;
  description: string;
  bullets: string[];
  tier: PlanTier;
};

const TOOL_TIER_LABEL: Record<PlanTier, string> = {
  FREE: "Free",
  ESSENTIAL: "Essential plan",
  PREMIUM: "Premium plan",
  CREDITS: "Credits",
};

const TOOL_TIER_BADGE_CLASS: Record<PlanTier, string> = {
  FREE: "border-slate-600 text-slate-200 bg-slate-800/60",
  ESSENTIAL: "border-sky-400 text-sky-200 bg-sky-500/10",
  PREMIUM: "border-emerald-400 text-emerald-200 bg-emerald-500/10",
  CREDITS: "border-purple-400 text-purple-200 bg-purple-500/10",
};

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

        {/* Plan key */}
        <section className="grid gap-3 rounded-2xl border border-hvn-card bg-hvn-bg-elevated/80 p-4 text-xs text-hvn-text-muted sm:grid-cols-4 sm:text-sm">
          <div>
            <p className="mb-1 font-semibold text-hvn-text-secondary">Free</p>
            <p>Always available for everyone.</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-hvn-text-secondary">
              Essential
            </p>
            <p>For deeper structure, habits, and light AI support.</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-hvn-text-secondary">
              Premium
            </p>
            <p>Full AI support and richer long-term insights.</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-hvn-text-secondary">
              Credits
            </p>
            <p>Pay-per-use for intensive AI sessions.</p>
          </div>
        </section>

        <div className="space-y-4">
          <ToolCard
            title="Gentle check-in"
            description="When you don't know what to write, use this as a soft starting point."
            bullets={[
              "What is one thing you are feeling right now?",
              "Where do you notice that feeling in your body?",
              "What would feel just 5% kinder to yourself in this moment?",
            ]}
            tier="FREE"
          />

          <ToolCard
            title="Breathing reset"
            description="Use this when your day feels too fast or crowded."
            bullets={[
              "Take 5 slow breaths—in for 4, out for 6.",
              "On each exhale, quietly name one thing you can let go of.",
              "Afterward, write one sentence about what shifted, even slightly.",
            ]}
            tier="FREE"
          />

          <ToolCard
            title="Reframing a worry"
            description="For moments when one thought keeps looping in your mind."
            bullets={[
              "Write down the worry in one clear sentence.",
              "Then write: “If a close friend told me this, what would I gently say back to them?”",
              "Let that kinder response be the last sentence you write.",
            ]}
            tier="FREE"
          />

          <ToolCard
            title="AI journal summary"
            description="(Essential) A short AI summary of today’s reflection to help you see the main thread."
            bullets={[
              "Write your reflection as usual.",
              "Use the upcoming AI summary tool to see your day in 3–4 gentle sentences.",
              "Notice one word or phrase that stands out and carry it with you.",
            ]}
            tier="ESSENTIAL"
          />

          <ToolCard
            title="Deep AI reflection"
            description="(Premium) A more detailed reflection looking at patterns, emotions, and needs."
            bullets={[
              "When a topic feels big or heavy, mark it for deep reflection.",
              "AI will help you explore possible needs underneath the feeling.",
              "Use this only when you have space to rest afterwards.",
            ]}
            tier="PREMIUM"
          />

          <ToolCard
            title="Credits-based deep dive"
            description="For occasional, in-depth AI-supported sessions without changing your plan."
            bullets={[
              "Ideal when you want a once-in-a-while deep dive.",
              "Uses credits instead of upgrading your whole plan.",
              "You stay in control of how often you use it.",
            ]}
            tier="CREDITS"
          />
        </div>

        <section className="rounded-2xl border border-hvn-card bg-hvn-bg-elevated/85 p-5 text-sm text-hvn-text-secondary shadow-sm shadow-black/40">
          <p className="font-medium text-hvn-accent-mint">
            Coming soon: AI-assisted tools
          </p>
          <p className="mt-2">
            Havenly Essential and Premium will be able to suggest tailored
            prompts and calming exercises based on your recent reflections—always
            with your privacy and boundaries at the center. Credits will be
            available for deeper sessions without needing to change your plan.
          </p>
        </section>
      </div>
    </div>
  );
}

function ToolCard({ title, description, bullets, tier }: ToolCardProps) {
  const badgeLabel = TOOL_TIER_LABEL[tier];
  const badgeClass = TOOL_TIER_BADGE_CLASS[tier];

  return (
    <article className="rounded-2xl border border-hvn-card bg-hvn-bg-elevated/85 p-5 shadow-sm shadow-black/50">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-hvn-text-secondary sm:text-base">
          {title}
        </h2>
        <span
          className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${badgeClass}`}
        >
          {badgeLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-hvn-text-muted">{description}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-hvn-text-muted">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </article>
  );
}
