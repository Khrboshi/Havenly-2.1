import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If already logged in, skip landing → dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-14 px-4 pt-12 md:pt-16">
      {/* HERO */}
      <section className="grid items-start gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Left column */}
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300/90">
            Havenly 2.1 · Early Access
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
            A calm space to{" "}
            <span className="text-emerald-300">decompress your day</span> in
            just a few minutes.
          </h1>

          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            Havenly is a private micro-journal. You write a few honest
            sentences, and a gentle AI reflection helps you see your day with
            more compassion and clarity — no pressure, no streaks, no social
            feed.
          </p>

          {/* Primary CTA + secondary login link */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/magic-login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start journaling now ✨
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-300 hover:text-emerald-200"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Social proof / reassurance */}
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs text-slate-300">
            <p>
              • Your entries stay private to you — we don&apos;t use them for
              ads or social feeds.
            </p>
            <p>• You can write as much or as little as you like, whenever.</p>
          </div>
        </div>

        {/* Right column – “preview card” style */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-12 rounded-[2.5rem] bg-emerald-500/5 blur-3xl" />

          <div className="relative space-y-3 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Tonight&apos;s check-in</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                3 min
              </span>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950/80 p-4">
              <p className="text-xs font-medium text-slate-200">
                How are you really feeling about today?
              </p>
              <p className="text-xs text-slate-400">
                Write a few sentences about what stood out — conversations,
                decisions, small wins, or moments that stayed with you.
              </p>

              <div className="mt-2 h-20 rounded-xl border border-dashed border-slate-700/80 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-500">
                “Today was more exhausting than I expected, but there were a
                couple of small moments that felt good…”
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-950/70 p-4">
              <p className="text-[11px] font-medium text-emerald-200">
                Gentle reflection (AI-assisted)
              </p>
              <p className="text-[11px] text-slate-300">
                It sounds like you were carrying a lot today, and still made
                space for small wins. What would it look like to acknowledge
                that effort instead of only what&apos;s left undone?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          How Havenly works
        </h2>

        <div className="grid gap-5 text-sm text-slate-300 md:grid-cols-3">
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              1 · Check in
            </p>
            <p>
              Once a day (or whenever you like), you answer a gentle prompt and
              jot down a few honest sentences.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              2 · Reflect
            </p>
            <p>
              Havenly&apos;s AI offers a soft reflection — not advice, just a
              different angle that helps you see your day with more clarity.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              3 · Notice patterns
            </p>
            <p>
              Over time, you&apos;ll see what energizes you, what drains you,
              and what you might want to change or protect.
            </p>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS NOTE */}
      <section className="flex flex-col gap-3 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-4 text-xs text-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-emerald-200">
            Early access · Havenly 2.1
          </p>
          <p className="text-slate-300">
            You&apos;re using an early version. Features may evolve as we learn
            from real journaling patterns — your feedback will help shape what
            comes next.
          </p>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 md:mt-0">
          Core journaling features are free during early access.
        </p>
      </section>
    </div>
  );
}
