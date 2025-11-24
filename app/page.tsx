"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();

  // If already logged in, skip landing → dashboard
  useEffect(() => {
    let isMounted = true;

    async function checkUser() {
      const { data } = await supabaseClient.auth.getUser();
      if (!isMounted) return;
      if (data.user) {
        router.replace("/dashboard");
      }
    }

    checkUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-5xl space-y-14 pt-12 md:pt-16">
      {/* TOP: HERO */}
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        {/* Left column */}
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300/90">
            HAVENLY 2.1 · EARLY ACCESS
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
            A calm space to{" "}
            <span className="text-emerald-300">decompress your day</span> in
            just a few minutes.
          </h1>

          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            Havenly is a private micro-journal. You jot down a few honest
            sentences, and a gentle AI reflection helps you see your day with a
            bit more compassion and clarity — no pressure, no streaks, no social
            feed.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/magic-login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-300"
            >
              Start free journal ✨
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900/60"
            >
              I already have an account
            </Link>
          </div>

          {/* Social proof / reassurance */}
          <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧘‍♀️</span>
              <span>Designed for busy, thoughtful people — not productivity robots.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>
                Private by design —{" "}
                <Link
                  href="/privacy"
                  className="underline decoration-dotted underline-offset-2 hover:text-slate-200"
                >
                  see how we protect your data
                </Link>
                .
              </span>
            </div>
          </div>
        </div>

        {/* Right column: 5-second check-in */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            TRY A 5-SECOND CHECK-IN
          </p>

          <p className="mb-4 text-sm text-slate-200">
            If today had a color, what would it be? 🎨  
            If it had a weather, what would it feel like? ⛅
          </p>

          <div className="mb-4 space-y-2 text-xs text-slate-400">
            <p>Examples people write:</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>“Grey but slowly clearing. Tired, but relieved I showed up.”</li>
              <li>“Bright yellow morning ☀️ then a heavy blue meeting.”</li>
              <li>“Stormy outside, but inside I&apos;m weirdly calm.”</li>
            </ul>
          </div>

          <Link
            href="/magic-login"
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white"
          >
            Capture today & get a reflection
          </Link>

          <p className="mt-3 text-[11px] text-slate-500">
            No commitment. Just one short entry and a gentle reflection from
            Havenly.
          </p>
        </div>
      </section>

      {/* MIDDLE: FEATURES */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="mb-1 text-xs font-semibold text-emerald-300">
            3–5 minute check-ins
          </p>
          <p className="text-xs text-slate-300">
            One mood slider, one short note. Havenly keeps things light so you
            actually want to come back.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="mb-1 text-xs font-semibold text-emerald-300">
            Gentle AI reflections
          </p>
          <p className="text-xs text-slate-300">
            Groq-powered reflections highlight small wins, patterns, and
            directions for kindness — not hustle.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="mb-1 text-xs font-semibold text-emerald-300">
            Private by default
          </p>
          <p className="text-xs text-slate-300">
            No feed, likes, or followers. Your entries stay tied to your
            account only.
          </p>
        </div>
      </section>

      {/* BOTTOM: FUTURE PREMIUM TEASER (non-breaking) */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:flex md:items-center md:justify-between md:gap-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-emerald-300">
            Coming soon · Havenly Premium
          </p>
          <p className="text-sm text-slate-200">
            Deeper trends, longer reflections, and premium features — built for
            people who want a gentle companion over the long run.
          </p>
        </div>
        <p className="mt-3 text-[11px] text-slate-500 md:mt-0">
          For now, everything you see is free while we learn from early users.
        </p>
      </section>
    </div>
  );
}
