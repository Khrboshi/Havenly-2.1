"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    let active = true;

    async function checkUser() {
      const { data } = await supabaseClient.auth.getUser();
      if (!active) return;
      if (data.user) router.replace("/dashboard");
    }

    checkUser();
    return () => { active = false };
  }, [router]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      {/* Small top label */}
      <p className="text-xs tracking-[0.2em] text-emerald-300 mb-4">
        HAVENLY 2.1 · MVP
      </p>

      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-100">
          A calm place to reflect,{" "}
          <span className="text-emerald-400">just a few minutes a day.</span>
        </h1>

        <p className="max-w-xl text-slate-300 text-sm md:text-base">
          Havenly helps you slow down, capture what is happening inside you,
          and receive a gentle AI-assisted reflection that feels supportive —
          not clinical, not overwhelming.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
          >
            Start journaling
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="text-emerald-300 font-medium text-sm mb-1">
            Daily check-ins
          </h3>
          <p className="text-xs text-slate-400">
            One mood slider and one reflection. No complex forms or long journaling requirements.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="text-emerald-300 font-medium text-sm mb-1">
            AI reflections
          </h3>
          <p className="text-xs text-slate-400">
            Groq-powered insights help you reframe your day with clarity and compassion.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="text-emerald-300 font-medium text-sm mb-1">
            Private by design
          </h3>
          <p className="text-xs text-slate-400">
            Your entries belong to you. No public feed. No ads. No tracking beyond what is essential.
          </p>
        </div>
      </section>
    </main>
  );
}
