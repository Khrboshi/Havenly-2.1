import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function PremiumPage({ searchParams }) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login?from=premium");
  }

  const user = session.user;
  const role = user.user_metadata?.role ?? "free";
  const isPremium = role === "premium";

  const status = searchParams?.status ?? null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Havenly Plus</h1>

        {status === "success" && (
          <div className="mb-6 p-4 border border-emerald-500 bg-emerald-500/10 rounded-xl text-emerald-300 text-sm">
            Your subscription was successful! Welcome to Havenly Plus.
          </div>
        )}

        {status === "cancel" && (
          <div className="mb-6 p-4 border border-red-500 bg-red-500/10 rounded-xl text-red-300 text-sm">
            Your upgrade was cancelled. No charges were made.
          </div>
        )}

        {isPremium ? (
          <>
            <p className="text-slate-300 mb-6">
              You are already a Havenly Plus subscriber. Enjoy unlimited AI
              reflections, deeper insights, premium tools, and priority access to
              new features.
            </p>

            <Link
              href="/settings"
              className="rounded-full bg-slate-800 px-6 py-2.5 text-sm font-medium hover:bg-slate-700"
            >
              Manage subscription
            </Link>
          </>
        ) : (
          <>
            <p className="text-slate-300 mb-8">
              Havenly is free to start. When you’re ready, Havenly Plus gives you
              deeper reflections, richer insights, and premium tools to help you
              understand your days with more clarity.
            </p>

            <div className="space-y-6">
              {/* Monthly Plan */}
              <form action="/api/stripe/create-checkout-session" method="POST">
                <input type="hidden" name="plan" value="monthly" />
                <button
                  type="submit"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-6 py-4 text-left hover:border-emerald-300 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">Monthly</div>
                      <div className="text-slate-400 text-sm">Billed monthly</div>
                    </div>
                    <div className="text-emerald-300 font-semibold">$5</div>
                  </div>
                </button>
              </form>

              {/* Yearly Plan */}
              <form action="/api/stripe/create-checkout-session" method="POST">
                <input type="hidden" name="plan" value="yearly" />

                <button
                  type="submit"
                  className="w-full rounded-xl border border-emerald-500 bg-slate-900/40 px-6 py-4 text-left hover:border-emerald-300 transition relative"
                >
                  <div className="absolute right-4 -top-3 bg-emerald-400 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">
                    Best value
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">Yearly</div>
                      <div className="text-slate-400 text-sm">Billed once per year</div>
                    </div>
                    <div className="text-emerald-300 font-semibold">$49</div>
                  </div>
                </button>
              </form>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
