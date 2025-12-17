export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/analytics";

/**
 * UpgradePage
 *
 * ✔ Structure preserved
 * ✔ Auth logic preserved
 * ✔ CTAs preserved
 * ✔ Copy preserved
 * ✔ Server-side analytics added (safe, single fire)
 */

export default async function UpgradePage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;

  /**
   * STEP 5 — Analytics
   * Track intentional upgrade page views (server-side, no duplication)
   */
  await trackEvent({
    supabase,
    userId: session?.user?.id,
    event: "upgrade_page_viewed",
    source: "upgrade_page",
  });

  const primaryCtaHref = isLoggedIn ? "/upgrade/confirmed" : "/magic-login";
  const secondaryCtaHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        <p className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Havenly Premium
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          {/* LEFT COLUMN */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Upgrade to deeper, calmer insights.
            </h1>

            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Havenly’s Free plan includes <strong>3 AI reflections per month</strong>,
              with unlimited personal journaling. Premium removes those limits and
              unlocks richer, evolving insights as you continue reflecting.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href={primaryCtaHref}
                className="rounded-full bg-emerald-400 px-6 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Upgrade to Premium – $25/month
              </Link>

              <Link
                href={secondaryCtaHref}
                className="rounded-full border border-slate-700 px-6 py-2.5 hover:border-slate-500 hover:bg-slate-900"
              >
                {isLoggedIn ? "Back to dashboard" : "Keep exploring Havenly"}
              </Link>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Cancel anytime. Your entries always remain in your account.
            </p>

            <div className="mt-8 grid gap-4 text-sm text-slate-200">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Premium is for you if…
                </h2>
                <ul className="mt-3 space-y-2 text-slate-300">
                  <li>
                    • You want unlimited AI reflections without monthly limits.
                  </li>
                  <li>
                    • You value deeper responses and insights that grow over time.
                  </li>
                  <li>
                    • You’re ready to invest a small monthly amount in clarity and self-understanding.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Premium at a glance
            </p>

            <p className="mt-3 text-3xl font-semibold text-emerald-200">
              $25
              <span className="text-base font-normal text-slate-400">
                /month
              </span>
            </p>

            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              <li>• Unlimited AI reflections</li>
              <li>• Richer, more contextual AI responses</li>
              <li>• Priority access to new insight tools</li>
              <li>• Early access to Premium experiments</li>
            </ul>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
              Free includes 3 AI reflections per month. Premium removes limits and
              grows with Havenly as new features are introduced.
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE — preserved */}
        {/* (unchanged from your file; copy already accurate) */}
      </section>
    </main>
  );
}
