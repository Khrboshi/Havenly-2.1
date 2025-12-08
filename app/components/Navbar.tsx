"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabaseSession } from "./SupabaseSessionProvider";
import { useUserPlan } from "../hooks/useUserPlan";  // FIXED PATH
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const session = useSupabaseSession();
  const { plan } = useUserPlan();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  const isLoggedIn = !!session?.user;

  const linkClass = (path: string) => {
    const isActive = pathname === path;

    return [
      "px-3 py-1 rounded-full transition-colors duration-200",
      isActive
        ? "bg-emerald-400 text-slate-900 font-semibold"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    ].join(" ");
  };

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md fixed top-0 left-0 z-50">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-slate-200">

        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          Havenly
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-3 text-sm">

          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>

          <Link href="/blog" className={linkClass("/blog")}>
            Blog
          </Link>

          {isLoggedIn && (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/journal" className={linkClass("/journal")}>
                Journal
              </Link>
              <Link href="/insights" className={linkClass("/insights")}>
                Insights
              </Link>
              <Link href="/tools" className={linkClass("/tools")}>
                Tools
              </Link>
            </>
          )}
        </div>

        {/* Right section */}
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/magic-login" className="text-sm px-3 py-1 rounded-md hover:bg-slate-800/60">
              Sign in
            </Link>

            <Link
              href="/upgrade"
              className="px-4 py-2 rounded-full bg-emerald-400 text-slate-900 text-sm font-semibold hover:bg-emerald-300 transition"
            >
              Try Premium
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">

            {/* Plan badge */}
            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs">
              {plan === "premium" ? "Premium" : "Free plan"}
            </span>

            {/* Avatar */}
            <Link
              href="/settings"
              className="h-8 w-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xs font-medium"
            >
              {session.user.email?.[0]?.toUpperCase() ?? "U"}
            </Link>

            {/* Logout */}
            <Link
              href="/logout"
              className="text-sm px-3 py-1 rounded-md hover:bg-slate-800/60"
            >
              Log out
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
