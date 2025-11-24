"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

const MOOD_LABELS = ["", "Drained", "Heavy", "In-between", "Okay", "Light"];

function sampleReflectionForMood(mood: number): string {
  switch (mood) {
    case 1:
      return "It sounds like today has been really heavy. It is okay to move slowly and only carry what you can right now.";
    case 2:
      return "You are holding a lot. See if there is one tiny thing you can postpone, delegate, or simply let be for today.";
    case 4:
      return "You seem to be managing things with care. Notice one small moment that felt good and give it a bit more space.";
    case 5:
      return "You are in a lighter space today. You might capture what is working well so you can return to it on harder days.";
    case 3:
    default:
      return "It is normal to feel mixed. Try to name one thing that felt hard and one thing that felt supportive today.";
  }
}

export default function HomePage() {
  const router = useRouter();
  const [mood, setMood] = useState<number>(3);

  // If user is already logged in, send them to the dashboard
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

  const moodLabel = MOOD_LABELS[mood];
  const reflectionPreview = sampleReflectionForMood(mood);

  return (
    <div className="space-y-14 py-10 md:py-14">
      {/* HERO SECTION */}
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Private AI journaling · Early access
          </div>

          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold text-slate-50 md:text-5xl">
              A calm space to unload your mind{" "}
              <span className="block text-emerald-300">
                in just a few minutes a day.
              </span>
            </h1>
            <p className="max-w-xl text-sm text-slate-300 md:text-[15px]">
              Havenly helps you pause, name what is happening inside you, and
              get a gentle AI reflection that feels like a supportive friend –
              not a productivity coach or a therapist.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-300"
            >
              Start your first reflection
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-300 hover:text-emerald-200"
            >
              See how it works
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px]">
                🔒
              </span>
              <span>Entries stay private to your account only.</span>
            </div>
            <Link
              href="/privacy"
              className="underline-offset-2 hover:text-emerald-200 hover:underline"
            >
              Read the privacy note
            </Link>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE PREVIEW */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
          <div className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            Try a 5-second check-in
          </div>

          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>How are you feeling today?</span>
              <span className="font-medium text-emerald-300">{moodLabel}</span>
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min={1}
                max={5}
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Low</span>
                <span>Okay</span>
                <span>Light</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Small check-ins like this are the core of Havenly. Once you sign
              up, they are saved to your private journal and reflected back to
              you over time.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300">
              Sample AI reflection
            </div>
            <p className="text-xs leading-relaxed text-slate-100">
              {reflectionPreview}
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
          How Havenly supports you
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-1 text-sm font-medium text-emerald-300">
              2-minute daily check-ins
            </h3>
            <p className="text-xs text-slate-400">
              One mood slider, one short note. No long forms, no pressure to
              sound &quot;smart&quot; or &quot;deep&quot; – just what is true
              for you today.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-1 text-sm font-medium text-emerald-300">
              Gentle AI reflections
            </h3>
            <p className="text-xs text-slate-400">
              Powered by Groq, reflections focus on validation, gentle
              reframing, and one small next step – without clinical or
              productivity jargon.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-1 text-sm font-medium text-emerald-300">
              Private by design
            </h3>
            <p className="text-xs text-slate-400">
              Your entries are tied to your account only. No public feed, no
              followers, no ads, and no dark patterns nudging you to share.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST + FINAL CTA */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-50">
            Ready to give your mind a quieter place to land?
          </h3>
          <p className="max-w-xl text-xs text-slate-400">
            Create a free account, try a few reflections this week, and see how
            it feels. If it does not help, you can simply stop – your entries
            stay private either way.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Create a free account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            I already have an account
          </Link>
        </div>
      </section>
    </div>
  );
}
