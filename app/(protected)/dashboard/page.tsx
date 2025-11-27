import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return (
      <div className="pt-32 text-center text-slate-300">
        <p>You must login first.</p>
        <Link href="/magic-login" className="text-emerald-300 underline">
          Go to magic login →
        </Link>
      </div>
    );
  }

  const user = session.user;
  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Friend";

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-24 px-6 text-slate-200">
      {/* Free Tier Banner */}
      <div className="mb-10 p-4 rounded-lg bg-emerald-900/20 border border-emerald-700/30 text-emerald-200 text-sm">
        You’re using the free plan — daily journaling is included.
        <br />
        Premium features such as weekly summaries, emotional patterns, and deep
        insights will be available soon.
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-semibold text-white mb-2">
        Welcome back, <span className="text-emerald-300">{displayName}</span>
      </h1>
      <p className="text-slate-400 mb-8">
        Take a moment to breathe and check in with yourself today.
      </p>

      {/* Primary Action */}
      <Link
        href="/journal/new"
        className="inline-block bg-emerald-400 text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-emerald-300 transition mb-12"
      >
        Start today’s reflection
      </Link>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {/* Journal Card */}
        <Link
          href="/journal"
          className="block rounded-xl bg-slate-800/40 border border-slate-700/40 p-5 hover:bg-slate-800/60 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-1">Journal</h3>
          <p className="text-slate-400 text-sm">
            Write a daily reflection and see it summarized by gentle AI.
          </p>
        </Link>

        {/* Tools */}
        <Link
          href="/tools"
          className="block rounded-xl bg-slate-800/40 border border-slate-700/40 p-5 hover:bg-slate-800/60 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-1">Tools</h3>
          <p className="text-slate-400 text-sm">
            Use quick prompts and calming exercises.
          </p>
        </Link>

        {/* Insights Coming Soon */}
        <Link
          href="/premium"
          className="block rounded-xl bg-slate-800/40 border border-slate-700/40 p-5 hover:bg-slate-800/60 transition"
        >
          <h3 className="text-lg font-semibold text-white mb-1">
            Insights (Coming Soon)
          </h3>
          <p className="text-slate-400 text-sm">
            Emotional patterns, weekly summaries, and clarity insights.
          </p>
        </Link>
      </div>

      {/* Recent Reflections */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-3">
          Recent reflections
        </h2>
        <p className="text-slate-400 mb-6">
          You haven’t written anything yet — your first entry will appear here
          once you check in.
        </p>

        <Link
          href="/journal"
          className="text-emerald-300 hover:underline text-sm"
        >
          View full journal →
        </Link>
      </div>
    </div>
  );
}
