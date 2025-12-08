"use client";

import Link from "next/link";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";

export default function ProtectedNavBar({ user }: { user: any }) {
  const { session } = useSupabase();
  const plan = useUserPlan(); // Free / Premium

  const email = session?.user?.email || user?.email || "";

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md fixed top-0 left-0 z-50">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-slate-200">

        {/* Logo */}
        <Link href="/dashboard" className="font-semibold text-lg">
          Havenly
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/tools">Tools</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Free vs Premium badge */}
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs">
            {plan === "premium" ? "Premium" : "Free plan"}
          </span>

          {/* User avatar */}
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

            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="text-xs text-slate-400 hover:text-red-300"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}
