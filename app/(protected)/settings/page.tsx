import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login?from=settings");
  }

  const user = session.user;
  const email = user.email;
  const role = user.user_metadata?.role ?? "free";
  const isPremium = role === "premium";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-3xl mx-auto px-4 pt-28 pb-20">

        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Settings
        </h1>

        <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/40">
          <p className="text-slate-300 mb-3">
            <span className="text-slate-400">Email:</span> {email}
          </p>

          <p className="text-slate-300">
            <span className="text-slate-400">Plan:</span>{" "}
            {isPremium ? (
              <span className="text-emerald-300 font-medium">Havenly Plus</span>
            ) : (
              <span className="text-slate-400">Free</span>
            )}
          </p>
        </div>

        {!isPremium && (
          <div className="mt-10 p-4 border border-emerald-500 rounded-xl bg-emerald-500/10 text-emerald-300 text-sm">
            Premium settings will be available once Havenly Plus launches.
          </div>
        )}
      </section>
    </main>
  );
}
