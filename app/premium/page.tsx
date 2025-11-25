export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function PremiumPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Require login to see this page
  if (!session?.user) {
    redirect("/login?from=premium");
  }

  const meta = (session.user.user_metadata ?? {}) as { role?: string };
  const role = meta.role ?? "free";
  const isPremium = role === "premium";

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 pt-12 pb-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Havenly Premium · Coming soon
        </p>

        <h1 className="text-3xl font-semibold text-slate-50">
          Deeper insights for the days that need a little more holding.
        </h1>

        <p className="text-sm text-slate-300">
          The free version of Havenly will always give you a calm, private place
          to write. Premium will gently layer on deeper insight tools for when
          you want to see patterns, track your seasons, and explore what&apos;s
          really shifting beneath the surface.
        </p>

        <div className="inline-flex rounded-full bg-slate-900/60 px-4 py-2 text-xs text-slate-300 border border-slate-800/60">
          <span className="mr-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {isPremium ? (
            <span>
              You&apos;re marked as{" "}
              <span className="font-semibold text-emerald-300">Premium</span>.
              Thanks for being an early supporter — features below are on the
              way.
            </span>
          ) : (
            <span>
              You&apos;re currently using the{" "}
              <span className="font-semibold text-emerald-300">free</span>{" "}
              version. Premium will be an optional upgrade later — your current
              journaling experience stays the same.
            </span>
          )}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300">
            WHAT YOU HAVE NOW
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Free journaling (always included)
          </h2>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Private daily reflections in a calm, ad-free space</li>
            <li>• Gentle AI reflection on what you wrote (no advice, no fixes)</li>
            <li>• No streaks, no pressure, no social feed</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/10 p-4 space-y-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300">
            COMING WITH PREMIUM
          </p>
          <h2 className="text-sm font-semibold text-slate-50">
            Deeper insight on your seasons
          </h2>
          <ul className="space-y-1 text-xs text-slate-200">
            <li>• Longer history and richer context for your reflections</li>
            <li>• Gentle trend views (no scoring your life)</li>
            <li>• Advanced AI prompts for deeper self-inquiry</li>
            <li>• Optional exports if you want to keep a local copy</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
        <h3 className="text-sm font-semibold text-slate-50">
          How upgrades will work
        </h3>
        <p>
          When Premium launches, you&apos;ll be able to upgrade from inside
          Havenly with a simple, cancel-anytime subscription. No hidden
          paywalls — you&apos;ll always see clearly what you&apos;re getting.
        </p>
        <p>
          Until then, feel free to keep using the free version as much or as
          little as you like. Havenly is designed to fit around your real life,
          not the other way round.
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-full bg-emerald-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-200"
        >
          Go back to my journal
        </Link>

        {!isPremium && (
          <p className="text-xs text-slate-400">
            When Premium is live, this page will become your upgrade hub.
          </p>
        )}
      </div>
    </div>
  );
}
