import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PremiumPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only authenticated users can see this page
  if (!session?.user) {
    redirect("/magic-login?from=premium");
  }

  const user = session.user;
  const role = user.user_metadata?.role ?? "free";
  const isPremium = role === "premium";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Havenly Plus</h1>

        {/* If user is premium (future state) */}
        {isPremium ? (
          <>
            <p className="text-slate-300 mb-6">
              You are already a Havenly Plus member. Premium features will
              appear here as soon as they go live.
            </p>
            <Link
              href="/settings"
              className="rounded-full bg-slate-800 px-6 py-2.5 text-sm hover:bg-slate-700"
            >
              Go to Settings
            </Link>
          </>
        ) : (
          <>
            {/* Coming Soon message */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500 text-emerald-300 text-sm">
              Premium features are coming soon. You’ll be able to unlock deeper
              insights, richer reflections, and advanced tools.
            </div>

            <p className="text-slate-300 mb-8">
              Havenly Plus will include:
            </p>

            <ul className="text-slate-300 space-y-3 mb-10 text-sm">
              <li>• Full AI analysis and insights</li>
              <li>• Unlimited daily reflections</li>
              <li>• Pattern tracking and mood timeline</li>
              <li>• Advanced Tools+ suite</li>
              <li>• Backup & full history</li>
              <li>• Early access to new features</li>
            </ul>

            <div className="p-4 border border-slate-700 rounded-xl text-center text-slate-300">
              Premium will be available soon.
              <br />
              <span className="text-emerald-300 font-medium">
                Stay tuned for updates.
              </span>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
