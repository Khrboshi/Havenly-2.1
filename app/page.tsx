// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">
          Havenly 2.1 · MVP
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          A calm space to reflect,{" "}
          <span className="text-emerald-300">a few minutes a day.</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Havenly helps you slow down, capture what is happening inside you,
          and get a short AI-assisted reflection that feels like a gentle
          coach, not a therapist or a productivity drill sergeant.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300 transition"
          >
            Start journaling
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-emerald-300 hover:text-emerald-200 transition"
          >
            I already have an account
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3 text-xs text-slate-300">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <p className="font-medium mb-1 text-slate-100">Daily check-ins</p>
          <p>
            One mood slider, one reflection. No complex forms or endless
            questions.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <p className="font-medium mb-1 text-slate-100">AI reflections</p>
          <p>
            Groq-powered insights help you reframe your day and spot tiny
            patterns over time.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <p className="font-medium mb-1 text-slate-100">Private by design</p>
          <p>
            Entries are tied to your account only. No public feed, no likes, no
            pressure.
          </p>
        </div>
      </section>
    </div>
  );
}
