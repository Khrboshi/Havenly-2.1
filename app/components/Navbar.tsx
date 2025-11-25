// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loggedIn = !!user;

  const isOnDashboard = pathname === "/dashboard";
  const isOnJournal =
    pathname === "/journal" || pathname.startsWith("/journal/");
  const isOnSettings = pathname === "/settings";

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Brand / Logo */}
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/40 transition hover:bg-emerald-500/20 hover:ring-emerald-300">
            <span className="text-sm font-semibold tracking-wide text-emerald-300">
              H
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-100">Havenly</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm ${
                  isOnDashboard
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/journal"
                className={`text-sm ${
                  isOnJournal
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                Journal
              </Link>

              <Link
                href="/settings"
                className={`text-sm ${
                  isOnSettings
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                Settings
              </Link>

              {/* Account dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-slate-700 hover:bg-slate-800"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-200">
                    {(user?.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <span className="max-w-[8rem] truncate">
                    {user?.user_metadata?.display_name || user?.email}
                  </span>
                  <span className="text-slate-500">▾</span>
                </button>

                {menuOpen && (
                  <div className="animate-fade-in absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-950/95 p-1 text-sm shadow-xl">
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800"
                    >
                      Account &amp; settings
                    </Link>
                    <Link
                      href="/logout"
                      prefetch={false}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-rose-300 hover:bg-rose-900/40"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-300 hover:text-emerald-200"
              >
                Log in
              </Link>
              <Link
                href="/magic-login"
                className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
