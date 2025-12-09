"use client";

import Link from "next/link";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "@/app/components/useUserPlan";

export default function ProtectedNavBar({ user }: { user: any }) {
  const { session } = useSupabase();
  const planState = useUserPlan();

  const rawPlan =
    typeof planState === "string"
      ? planState
      : planState?.plan || "FREE";

  const normalizedPlan = rawPlan?.toUpperCase() ?? "FREE";
  const email = session?.user?.email || user?.email || "";

  function getPlanLabel() {
    if (normalizedPlan === "PREMIUM") return "Premium";
    if (normalizedPlan === "TRIAL") return "Trial";
    return "Free plan";
  }

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md fixed top-0 left-0 z-50">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-slate-200">
        <Link href="/dashboard" className="font-semibold text-lg">
          Havenly
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/tools">Tools</Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs">
            {getPlanLabel()}
          </span>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              {email?.charAt(0)?.toUpperCase()}
            </span>

            <Link
              href="/settings"
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Settings
            </Link>

            <Link
              href="/logout"
              className="text-xs text-slate-400 hover:text-red-300"
            >
              Log out
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
