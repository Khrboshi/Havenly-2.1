"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load user on mount + subscribe to auth state changes
  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (active) setUser(session?.user ?? null);
    }

    load();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

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
  const isOnJournal = pathname.startsWith("/journal");
  const isOnSettings = pathname.startsWith("/settings");

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href={loggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/40">
            <span className="text-sm font-semibold text-emerald-300">H</span>
          </div>
          <span className="text-sm font-semibold text-slate-100">Havenly</span>
        </Link>

        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm ${
                  isOnDashboard ? "text-emerald-300" : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/journal"
                className={`text-sm ${
                  isOnJournal ? "text-emerald-300" : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                Journal
              </Link>

              <Link
                href="/settings"
                className={`text-sm ${
                  isOnSettings ? "text-emerald-300" : "text-slate-300 hover:text-emerald-200"
                }`}
              >
                Settings
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
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
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-950/95 p-1 text-sm shadow-xl">
                    <Link
                      href="/settings"
                      className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800"
                    >
                      Account & settings
                    </Link>
                    <Link
                      href="/logout"
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
              <Link href="/login" className="text-sm text-slate-300 hover:text-emerald-200">
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
