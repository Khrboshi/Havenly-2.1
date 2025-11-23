"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();

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
    return () => { isMounted = false };
  }, [router]);

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col items-start space-y-8">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] text-emerald-300">
              HAVENLY 2.1 · MVP
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-100">
              A calm space to reflect,{" "}
              <span className="text-emerald-400">a few minutes a day.</span>
            </h1>

            <p className="text-slate-300 max-w-xl text-sm md:text-base">
              Havenly helps you slow down, capture what is happening inside you,
              and get a short AI-assisted reflection that feels like a gentle
              coach, not a therapist or a productivity drill sergeant.
            </p>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <h3 className="text-emerald-300 font-medium text-sm mb-1">
                Daily check-ins
              </h3>
              <p className="text-xs text-slate-400">
                One mood slider, one reflection. No complex forms or endless
                questions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <h3 className="text-emerald-300 font-medium text-sm mb-1">
                AI reflections
              </h3>
              <p className="text-xs text-slate-400">
                Groq-powered insights help you reframe your day and spot tiny
                patterns over time.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <h3 className="text-emerald-300 font-medium text-sm mb-1">
                Private by design
              </h3>
              <p className="text-xs text-slate-400">
                Entries are tied to your account only. No public feed, no likes,
                no pressure.
              </p>
            </div>
          </div>

          {/* NEW TRUST / PRIVACY NOTE */}
          <div className="mt-10 max-w-xl text-xs text-slate-400 leading-relaxed bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            Havenly is built with privacy at the core. Your journal entries are
            encrypted in transit and securely stored. We never sell your data,
            never train external AI models with your writing, and your thoughts
            remain yours only.
            <br />
            <Link
              href="/privacy"
              className="text-emerald-300 underline hover:text-emerald-200"
            >
              Read our Privacy Policy →
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 py-8 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <p>
          Havenly 2.1 — A quiet space for intentional reflection.  
          <Link
            href="/privacy"
            className="ml-2 text-emerald-300 underline hover:text-emerald-200"
          >
            Privacy Policy
          </Link>
        </p>
      </footer>
    </>
  );
}
