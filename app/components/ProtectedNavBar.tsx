"use client";

import Link from "next/link";
import { useState } from "react";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";

export default function ProtectedNavBar() {
  const { session } = useSupabase();
  const { plan, credits } = useUserPlan();

  const user = session?.user;
  const email = user?.email ?? "User";
  const firstLetter = email.charAt(0).toUpperCase();

  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="text-white font-semibold text-lg">
          Havenly
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Plan badge */}
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 capitalize">
            {plan ?? "free"}
          </span>

          {/* Credits badge */}
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300">
            Credits: {credits ?? 0}
          </span>

          {/* Avatar */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold hover:bg-slate-600 transition"
          >
            {firstLetter}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-6 mt-16 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-lg p-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                Dashboard
              </Link>

              <Link
                href="/insights"
                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                Insights
              </Link>

              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                Settings
              </Link>

              <Link
                href="/logout"
                className="block mt-1 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                Log out
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
