"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  user: User | null;
}

/**
 * Havenly 2.1 Navigation Bar
 * - Minimal rerenders
 * - Optimized for CSR + SSR hybrid
 * - Works perfectly with /logout client signout flow
 */
export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: highlight active tab
  function navClass(active: boolean) {
    return active
      ? "text-emerald-300"
      : "text-slate-300 hover:text-emerald-200";
  }

  const loggedIn = !!user;
  const displayInitial =
    (user?.email?.[0] ?? user?.user_metadata?.display_name?.[0] ?? "U").toUpperCase();
  const displayName =
    user?.user_metadata?.display_name || user?.email || "User";

  // Logout button (client-side)
  const handleLogout = () => {
    window.location.href = "/logout"; // triggers the improved logout page
  };

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">

        {/* Brand */}
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

        {/* Right side navigation */}
        <div className="flex items-center gap-4">

          {/* Logged OUT */}
          {!loggedIn && (
            <>
              <Link href="/login" className="text-sm text-slate-300 hover:text-emerald-200">
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300"
              >
                Get started
              </Link>
            </>
          )}

          {/* Logged IN */}
          {loggedIn && (
            <>
              <Link href="/dashboard" className={navClass(pathname === "/dashboard")}>
                Dashboard
              </Link>

              <Link
                href="/journal"
                className={navClass(
                  pathname === "/journal" || pathname.startsWith("/journal/")
                )}
              >
                Journal
              </Link>

              <Link href="/settings" className={navClass(pathname === "/settings")}>
                Settings
              </Link>

              {/* Account dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-slate-700 hover:bg-slate-800"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-200">
                    {displayInitial}
                  </div>

                  <span className="max-w-[8rem] truncate">{displayName}</span>
                  <span className="text-slate-500">▾</span>
                </button>

                {dropdownOpen && (
                  <div className="animate-fade-in absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-950/95 p-1 text-sm shadow-xl">
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800"
                    >
                      Account & settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-rose-300 hover:bg-rose-900/40"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}
