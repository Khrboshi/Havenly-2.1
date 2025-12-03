// app/(protected)/tools/page.tsx

export const dynamic = "force-dynamic";

export default function ToolsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 md:px-6 lg:px-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Havenly Tools
          </h1>
          <p className="max-w-2xl text-slate-300">
            A calm place to experiment with gentle AI helpers. Over time this
            page will grow into a small toolbox that supports your journaling
            ritual—without pressure, streaks, or productivity hacks.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-50">
              ✨ AI reflection helper
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              In future versions, you&apos;ll be able to gently explore what you
              wrote with AI—asking clarifying questions, surfacing themes, and
              noticing patterns over time.
            </p>
            <p className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Coming in a premium plan
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-50">
              🔐 Private export & backups
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Planned tools will include ways to securely export, back up, and
              move your reflections—so your words always stay under your
              control.
            </p>
            <p className="mt-3 inline-flex rounded-full bg-slate-700/60 px-3 py-1 text-xs font-medium text-slate-200">
              Not yet available
            </p>
          </div>
        </section>

        <section className="mt-4 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
          <p>
            For now, the most important tool is still your daily reflection
            page. As Havenly grows, this area will stay focused on simple,
            humane tools that support your wellbeing—not ads or attention
            traps.
          </p>
        </section>
      </main>
    </div>
  );
}
