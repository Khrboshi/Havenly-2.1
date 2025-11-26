"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">

        {/* Left: Logo */}
        <Link href="/" className="text-lg font-semibold text-slate-200">
          Havenly
        </Link>

        {/* Right side navigation */}
        <div className="flex items-center gap-6 text-sm">

          {!user && (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white">
                Log in
              </Link>

              <Link
                href="/magic-login"
                className="rounded-full bg-emerald-400 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-300"
              >
                Start journaling free
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/journal"
                className="text-slate-300 hover:text-white"
              >
                Journal
              </Link>

              <Link
                href="/logout"
                className="rounded-full bg-slate-800 px-4 py-2 font-medium hover:bg-slate-700"
              >
                Log out
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
