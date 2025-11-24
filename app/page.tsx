// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();

  // If already logged in, skip the marketing page.
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
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <div className="flex flex-col items-start space-y-10">
        {/* Hero copy */}
        <div className="space-y-3">
          <p className="text-xs tracking-[0.2em] text-emerald-300">
            HAVENLY 2.1 · MVP
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-100 md:text-5xl">
            A calm space to reflect,{" "}
            <span className="text-emerald-400">a few minutes a day.</span>
          </h1>

          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            Havenly helps you slow down, capture what&apos;s happening inside
            you, and get a short AI-assisted reflection that feels like a gentle
            coach — not a therapist, and not a productivity drill sergeant.
          </p>

          <p className="text-xs text-slate-400 md:text-sm">
            No passwords to remember. Sign in with a private magic link sent to
            your inbox, and pick up your reflections from any device.
          </p>
        </div>

        {/* Primary actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/magic-login"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Try a 5-second check-in ✨
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            I already have an account
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="mb-1 text-sm font-medium text-emerald-300">
              Daily check-ins
            </h3>
            <p className="text-xs text-slate-400">
              One mood slider, one reflection. No complex forms or endless
              questions — just a tiny daily pause.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="mb-1 text-sm font-medium text-emerald-300">
              AI reflections
            </h3>
            <p className="text-xs text-slate-400">
              Groq-powered insights help you reframe your day, notice patterns,
              and gently nudge yourself toward what you need.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="mb-1 text-sm font-medium text-emerald-300">
              Private by design
            </h3>
            <p className="text-xs text-slate-400">
              Your entries are tied only to your account. No public feed, no
              likes, no judgment — just your own honest check-ins.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
