// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hvn-accent-blue">
            About Havenly
          </p>
          <h1 className="text-3xl font-semibold text-hvn-text-primary sm:text-4xl">
            A calm, private space to{" "}
            <span className="text-hvn-accent-mint">check in</span> with
            yourself.
          </h1>
          <p className="max-w-2xl text-sm text-hvn-text-muted sm:text-base">
            Havenly is a lightweight micro-journal designed for real life—the
            tired evenings, in-between meetings, and quiet moments where you
            just need a safe place to think out loud for a few minutes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AboutCard title="What Havenly is">
            <ul className="space-y-2 text-sm text-hvn-text-muted">
              <li>
                • A distraction-free page where a few honest sentences are
                enough.
              </li>
              <li>
                • Gentle AI reflections that highlight what felt important in
                your own words.
              </li>
              <li>
                • A private way to notice emotional patterns without charts
                judging you.
              </li>
            </ul>
          </AboutCard>

          <AboutCard title="What Havenly is not">
            <ul className="space-y-2 text-sm text-hvn-text-muted">
              <li>• No public feed, comments, or “likes.”</li>
              <li>• No streaks, productivity scores, or pushy reminders.</li>
              <li>• No optimization or life-hacking advice from the AI.</li>
            </ul>
          </AboutCard>
        </div>

        <AboutCard title="A gentle use of AI you can trust">
          <p className="text-sm text-hvn-text-muted">
            The AI in Havenly is intentionally quiet. Its role is to mirror back
            what you wrote, ask kinder questions, or surface themes you might
            have missed—not to tell you what to do. Reflections are used only to
            generate your summaries and insights, not for advertising or social
            media content.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-hvn-text-muted">
            <li>• No ads or growth-hacking notifications.</li>
            <li>• No selling your entries as “engagement data.”</li>
            <li>• You stay in control—you choose what to write, and when.</li>
          </ul>
        </AboutCard>

        <AboutCard title="Free today, with deeper insights coming soon">
          <p className="text-sm text-hvn-text-muted">
            Right now, Havenly focuses on making daily journaling feel as simple
            and low-pressure as possible. The free plan gives you a private
            space to write and revisit your reflections.
          </p>
          <p className="mt-2 text-sm text-hvn-text-muted">
            We are working on{" "}
            <span className="text-hvn-accent-mint font-medium">
              Havenly Plus
            </span>
            , which will add:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-hvn-text-muted">
            <li>• Richer AI insights and weekly summaries.</li>
            <li>• Emotional patterns and mood timelines over time.</li>
            <li>• Backup, history, and advanced reflection tools.</li>
          </ul>
        </AboutCard>

        <AboutCard title="A small, human-sized product">
          <p className="text-sm text-hvn-text-muted">
            Havenly is being built carefully and incrementally, with a focus on
            calm design, emotional safety, and clear boundaries around how AI is
            used. The goal is not to keep you online longer, but to give you a
            few honest minutes with yourself and then let you get back to your
            day.
          </p>
          <p className="mt-3 text-sm text-hvn-text-muted">
            If Havenly helps you exhale a little, notice one feeling more
            clearly, or speak to yourself with a bit more kindness, then it is
            doing its job.
          </p>
        </AboutCard>
      </div>
    </div>
  );
}

type AboutCardProps = {
  title: string;
  children: React.ReactNode;
};

function AboutCard({ title, children }: AboutCardProps) {
  return (
    <section className="rounded-2xl border border-hvn-card bg-hvn-bg-elevated/85 p-5 shadow-sm shadow-black/50">
      <h2 className="text-sm font-semibold text-hvn-text-secondary sm:text-base">
        {title}
      </h2>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}
