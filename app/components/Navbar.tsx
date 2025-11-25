// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type SimpleUser = {
  id: string;
  email?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load current user + subscribe to auth changes (login / logout)
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data } = await supabaseClient.auth.getUser();
      if (!isMounted) return;

      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
      } else {
        setUser(null);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
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

  function handleLogoClick() {
    // If logged in, logo sends you to dashboard; otherwise landing page
    router.push(loggedIn ? "/dashboard" : "/");
  }

  async function handleLogout() {
    try {
      await supabaseClient.auth.signOut();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setDropdownOpen(false);
      setMenuOpen(false);
      // Send user back to login with a small flag (you can read this in login page if you want a banner)
      router.replace("/login?logged_out=1");
    }
  }

  const displayName = user?.email?.split("@")[0] ?? "You";
  const displayInitial = (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT: Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-400 flex items-center justify-center text-slate-900 font-bold transition-opacity group-hover:opacity-70">
            H
          </div>
          <span className="text-slate-100 font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
            Havenly
          </span>
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-4">
          {loggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm ${
                  isOnDashboard
                    ? "text-emerald-300"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/journal"
                className={`text-sm ${
                  isOnJournal
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Journal
              </Link>
              <Link
                href="/settings"
                className={`text-sm ${
                  isOnSettings
                    ? "text-emerald-300"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Settings
              </Link>
            </>
          )}

          {!loggedIn && (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-300 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/magic-login"
                className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition"
              >
                Start free journaling
              </Link>
            </>
          )}

          {loggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800 transition"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-[11px] font-semibold text-emerald-200">
                  {displayInitial}
                </span>
                <span>{displayName}</span>
                <span className="text-slate-500 text-[10px]">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-slate-900/95 shadow-lg py-1 text-xs animate-fade-in">
                  <Link
                    href="/settings"
                    className="block px-3 py-2 text-slate-200 hover:bg-slate-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Account &amp; settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-300 hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-700 px-2 py-1.5 text-slate-100"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="text-xs">{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 animate-slide-down">
          <div className="max-w-4xl mx-auto px-4 py-3 space-y-2 text-sm">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-1 text-slate-100 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/journal"
                  className="block py-1 text-slate-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Journal
                </Link>
                <Link
                  href="/settings"
                  className="block py-1 text-slate-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full text-left py-2 text-red-300 border-t border-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-1 text-slate-100 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/magic-login"
                  className="block mt-2 rounded-xl bg-emerald-400 text-center text-slate-950 py-2 font-medium hover:bg-emerald-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Start free journaling
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
