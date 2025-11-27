import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export default async function InsightsPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login?from=insights");
  }

  const role = session.user.user_metadata?.role ?? "free";
  const isPremium = role === "premium";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-3xl mx-auto px-4 pt-28">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Insights</h1>

        {!isPremium && (
          <div className="mb-6 p-4 border border-emerald-500 bg-emerald-500/10 rounded-xl text-emerald-300 text-sm">
            Insights are part of Havenly Plus and will be available soon.
          </div>
        )}

        {isPremium ? (
          <p className="text-slate-300">
            Premium insights will appear here once Havenly Plus launches.
          </p>
        ) : (
          <div className="mt-6">
            <Link
              href="/premium"
              className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
            >
              View Premium Features
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
