import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
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

        <div className="flex flex-wrap gap-4">
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
      </div>
    </main>
  );
}
