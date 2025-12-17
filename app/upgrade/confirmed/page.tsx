export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function UpgradeConfirmedPage() {
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-xl text-center space-y-4">
          <h1 className="text-2xl font-semibold">Please sign in to continue</h1>
          <Link
            href="/magic-login"
            className="rounded-full bg-emerald-400 px-6 py-2.5 font-semibold text-slate-950"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <p className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          Almost there
        </p>

        <h1 className="text-3xl font-semibold">
          You’re ready to unlock Premium
        </h1>

        <p className="text-sm text-white/70">
          Premium increases your monthly reflection allowance and gives you
          priority access to deeper insight tools as they’re released.
        </p>

        <div className="flex gap-3">
          <Link
            href="/settings/billing"
            className="rounded-full bg-emerald-400 px-6 py-2.5 font-semibold text-slate-950"
          >
            Continue to billing
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 px-6 py-2.5"
          >
            Back to dashboard
          </Link>
        </div>

        <p className="text-xs text-white/50">
          No pressure. You can upgrade anytime.
        </p>
      </div>
    </main>
  );
}
