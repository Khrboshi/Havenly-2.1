"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "./SupabaseSessionProvider";
import { useUserPlan } from "./useUserPlan";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();
  const { planType, loading } = useUserPlan();

  const planLabel = loading
    ? "Loading..."
    : planType === "PREMIUM"
    ? "Premium"
    : planType === "TRIAL"
    ? "Trial"
    : "Free plan";

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const isDashboard = pathname === "/dashboard";
  const isJournal = pathname.startsWith("/journal");
  const isInsights = pathname.startsWith("/insights");
  const isTools = pathname.startsWith("/tools");
  const isBlog = pathname.startsWith("/blog");

  const isLoggedIn = !!session?.user;

  if (!hydrated) {
    return (
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="h-4 w-20 rounded-full bg-slate-800" />
          <div className="h-8 w-32 rounded-full bg-slate-800" />
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
              <span className="text-sm font-semibold text-emerald-300">
                H
              </span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              Havenly
            </span>
          </Link>

          {/* Main nav */}
          <div className="hidden items-center gap-3 text-xs font-medium text-slate-400 md:flex">
            <Link
              href="/dashboard"
              className={
                "rounded-full px-3 py-1 transition " +
                (isDashboard
                  ? "bg-slate-800 text-slate-50"
                  : "hover:bg-slate-900")
              }
            >
              Dashboard
            </Link>
            <Link
              href="/journal"
              className={
                "rounded-full px-3 py-1 transition " +
                (isJournal
                  ? "bg-slate-800 text-slate-50"
                  : "hover:bg-slate-900")
              }
            >
              Journal
            </Link>
            <Link
              href="/insights"
              className={
                "rounded-full px-3 py-1 transition " +
                (isInsights
                  ? "bg-slate-800 text-slate-50"
                  : "hover:bg-slate-900")
              }
            >
              Insights
            </Link>
            <Link
              href="/tools"
              className={
                "rounded-full px-3 py-1 transition " +
                (isTools
                  ? "bg-slate-800 text-slate-50"
                  : "hover:bg-slate-900")
              }
            >
              Tools
            </Link>
            <Link
              href="/blog"
              className={
                "rounded-full px-3 py-1 transition " +
                (isBlog
                  ? "bg-slate-800 text-slate-50"
                  : "hover:bg-slate-900")
              }
            >
              Blog
            </Link>
          </div>
        </div>

        {/* Right: Auth / plan area */}
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              href="/magic-login"
              className="text-sm px-3 py-1 rounded-md hover:bg-slate-800/60"
            >
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
              {planLabel}
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
