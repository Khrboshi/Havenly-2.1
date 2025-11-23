"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // Desktop dropdown

  const mobileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load user + subscribe to auth changes
  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user);
    }
    load();

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh();
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, [router]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function gotoDashboard() {
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-lg px-5 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT: Logo (click → home or dashboard) */}
      <button
        onClick={() => (user ? gotoDashboard() : router.push("/"))}
        className="flex items-center gap-2 group cursor-pointer"
      >
        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold group-hover:opacity-70 transition">
          H
        </div>
        <span className="text-slate-200 font-semibold hidden sm:block group-hover:opacity-70 transition">
          Havenly
        </span>
      </button>

      {/* DESKTOP (≥ sm) RIGHT SIDE */}
      <div className="hidden sm:flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/login" className="nav-btn">
              Log in
            </Link>
            <Link href="/signup" className="nav-primary-btn">
              Get started
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((s) => !s)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-4 py-2 rounded-xl"
            >
              <span className="text-slate-200 text-sm">
                {user.email?.split("@")[0]}
              </span>
              <span className="text-slate-400">▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-2 flex flex-col text-sm animate-fadeIn">
                <button onClick={gotoDashboard} className="dropdown-item">
                  Dashboard
                </button>

                <Link href="/settings" className="dropdown-item">
                  Settings
                </Link>

                <button
                  className="dropdown-item text-red-300 hover:text-red-400"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MOBILE HAMBURGER ( < sm ) */}
      <button
        className="sm:hidden text-slate-200 text-3xl"
        onClick={() => setMenuOpen((s) => !s)}
      >
        ☰
      </button>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          ref={mobileRef}
          className="absolute left-0 top-14 w-full bg-slate-900 border-t border-slate-800 sm:hidden animate-slideDown shadow-xl z-40"
        >
          <div className="flex flex-col p-4 space-y-4">
            {!user ? (
              <>
                <Link href="/login" className="mobile-item">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="mobile-item bg-emerald-500 text-slate-900 rounded-lg text-center py-2 font-semibold"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                <button onClick={gotoDashboard} className="mobile-item">
                  Dashboard
                </button>

                <Link href="/settings" className="mobile-item">
                  Settings
                </Link>

                <button
                  className="mobile-item text-red-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
