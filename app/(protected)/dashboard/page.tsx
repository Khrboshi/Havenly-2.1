export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const meta = (session.user.user_metadata ?? {}) as { role?: string };
  const role = meta.role ?? "free";
  const isPremium = role === "premium";

  const firstName =
    session.user.email?.split("@")[0]?.split(".")[0] ?? "Friend";

  return (
    <div className="mx-auto max-w-4xl px-4 pt-20 pb-24 space-y-10">

      {/* Greeting */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">
          Welcome back,{" "}
          <span className="text-emerald-300">
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
          </span>
        </h1>

        <p className="text-sm text-slate-300 max-w-xl">
          This is your calm space to slow down for a moment, breathe, and
          notice how you are really doing today.
        </p>

        {/* Show ONLY to FREE users */}
        {!isPremium && (
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-slate-800/60 px-3 py-1 mt-2 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            You’re using the free journaling plan — premium insights coming soon
          </div>
        )}

        <div className="pt-4">
          <Link
            href="/journal/new"
            className="inline-flex rounded-full bg-emerald-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-200"
          >
            Start today’s reflection
          </Link>
        </div>
      </header>

      {/* Recent reflections */}
      <section className="space-y-3 pt-6">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-emerald-300">
          RECENT REFLECTIONS
        </h2>

        <p className="text-sm text-slate-400">
          You haven’t written anything yet — your first reflection will appear here.
        </p>

        <Link
          href="/journal"
          className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
        >
          View full journal →
        </Link>
      </section>

      {/* Install-on-phone hint — visible to ALL logged-in users */}
      <section className="pt-6 hidden install-hint">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300">
            ADD TO YOUR PHONE
          </p>
          <p className="text-sm text-slate-300">
            Add Havenly to your home screen to open it like an app and journal without browser tabs.
          </p>
          <p className="text-xs text-slate-400">
            iPhone: Share button → “Add to Home Screen”
            <br />
            Android: Browser menu → “Install App”
          </p>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches
              || window.navigator.standalone === true;

            if (!isStandalone) {
              document.querySelector('.install-hint')?.classList.remove('hidden');
            }
          `,
        }}
      />
    </div>
  );
}
