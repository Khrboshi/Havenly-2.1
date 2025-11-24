"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

const MOOD_LABELS = [
  { value: 1, emoji: "😣", label: "Drained", blurb: "Today feels heavy and tiring." },
  { value: 2, emoji: "😕", label: "Not great", blurb: "Some things are weighing on you." },
  { value: 3, emoji: "😐", label: "In between", blurb: "Not bad, not great — just okay." },
  { value: 4, emoji: "🙂", label: "Light", blurb: "There are small bright spots in your day." },
  { value: 5, emoji: "😄", label: "Good", blurb: "You feel grounded and fairly positive." },
];

// Mock data for “your next 10 reflections” preview (no backend call)
const DEMO_HISTORY = [2, 3, 4, 3, 5, 4, 2, 4, 5, 3];

export default function HomePage() {
  const router = useRouter();
  const [demoMood, setDemoMood] = useState<number>(3);

  // Auto-redirect logged-in users to the dashboard (same behavior as before)
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

  const currentMood =
    MOOD_LABELS.find((m) => m.value === demoMood) ?? MOOD_LABELS[2];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 space-y-12">
      {/* HERO SECTION */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-300">
          <span className="text-xs">✨</span>
          <span>Havenly 2.1 · Early access</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-100">
            A calm space to reflect,{" "}
            <span className="text-emerald-400">
              a few minutes a day.
            </span>
          </h1>

          <p className="text-slate-300 max-w-xl text-sm md:text-base">
            Havenly helps you slow down, capture what is happening inside
            you, and get a short AI-assisted reflection that feels like a
            gentle coach — not a therapist, not a productivity drill sergeant.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
          >
            Start free journal
          </Link>

          <a
            href="#demo-checkin"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition flex items-center gap-2"
          >
            <span>Try a 5-second check-in</span>
            <span>⏱️</span>
          </a>
        </div>

        {/* Trust / reassurance line */}
        <p className="text-xs text-slate-500">
          No public feed, no followers, no likes. Just you, your words, and a
          private space to breathe.
        </p>
      </section>

      {/* DEMO CHECK-IN SECTION */}
      <section
        id="demo-checkin"
        className="grid gap-6 md:grid-cols-[1.2fr,1fr] items-start"
      >
        {/* Left: Interactive 5-second demo */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Try a 5-second check-in
              </h2>
              <p className="text-xs text-slate-400">
                Choose how you feel right now. This is the exact step you’ll
                see inside Havenly.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
              <span>Private by design</span>
              <span>🔒</span>
            </div>
          </div>

          {/* Emoji mood scale */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              {MOOD_LABELS.map((m) => (
                <div
                  key={m.value}
                  className="flex flex-col items-center gap-1 w-8"
                >
                  <span
                    className={
                      m.value === demoMood ? "text-lg" : "text-base opacity-70"
                    }
                  >
                    {m.emoji}
                  </span>
                  <span className="hidden sm:block truncate text-[10px]">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={demoMood}
              onChange={(e) => setDemoMood(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Description for current mood */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentMood.emoji}</span>
              <span className="font-medium text-slate-100">
                {currentMood.label}
              </span>
            </div>
            <p className="text-slate-400">{currentMood.blurb}</p>
          </div>

          {/* Disabled "preview" button */}
          <button
            disabled
            className="mt-1 w-full rounded-full bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 cursor-default"
          >
            In the real app, this is where you’d write a few lines and get a
            gentle AI reflection 💬
          </button>
        </div>

        {/* Right: 10-reflection preview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100">
            See your next 10 reflections
          </h3>
          <p className="text-xs text-slate-400">
            Here is a preview of how your mood could look after{" "}
            <span className="font-semibold text-slate-200">
              just 10 quick check-ins.
            </span>{" "}
            In your account, this chart is built only from your private
            entries.
          </p>

          {/* Simple bar preview */}
          <div className="mt-3 h-28 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 flex flex-col justify-between">
            <div className="flex items-end gap-1 h-16">
              {DEMO_HISTORY.map((mood, idx) => {
                const height = 20 + mood * 8; // simple visual scaling
                return (
                  <div
                    key={idx}
                    className="flex-1 rounded-full bg-emerald-500/25"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Day 1</span>
              <span>Day 5</span>
              <span>Day 10</span>
            </div>
          </div>

          {/* Supporting copy + CTA */}
          <div className="space-y-2 text-xs">
            <p className="text-slate-400">
              Over time, Havenly helps you see subtle patterns: what lifts you,
              what drains you, and how your emotional baseline shifts.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition"
            >
              Create a free account to start your own graph →
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK VALUE PILLARS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5">
          <h3 className="text-emerald-300 font-medium text-sm">
            Daily check-ins ⏰
          </h3>
          <p className="text-xs text-slate-400">
            One mood slider, one reflection. No complex trackers, no endless
            forms — just a tiny daily pause.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5">
          <h3 className="text-emerald-300 font-medium text-sm">
            Gentle AI reflections 💬
          </h3>
          <p className="text-xs text-slate-400">
            Short, human-sounding reflections help you reframe your day and
            notice small wins that are easy to miss.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5">
          <h3 className="text-emerald-300 font-medium text-sm">
            Private by design 🔒
          </h3>
          <p className="text-xs text-slate-400">
            Your entries stay tied to your account only. No public feed, no
            social pressure — just honest check-ins with yourself.
          </p>
        </div>
      </section>
    </div>
  );
}
