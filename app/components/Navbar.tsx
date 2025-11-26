"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user: { email?: string | null } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const isLoggedIn = !!user;

  return (
    <nav className="w-full border-b border-slate-900/40 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* Logo / Home link */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-100 hover:text-emerald-300 transition-colors"
        >
          Havenly
        </Link>

        {/* RIGHT SIDE CONTENT */}
        <div className="flex items-center gap-6">

          {/* LOGGED OUT VIEW */}
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
            </>
          )}

          {/* LOGGED IN VIEW */}
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/journal"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/journal")
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Journal
              </Link>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                Premium (coming soon)
              </span>

              {/* User badge */}
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-slate-200">
                {user?.email}
              </span>

              {/* Logout */}
              <Link
                href="/logout"
                className="text-sm font-medium text-slate-300 hover:text-red-300 transition-colors"
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
