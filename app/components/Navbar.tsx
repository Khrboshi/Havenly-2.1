"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user);
    }
    load();
  }, []);

  async function handleLogout() {
    router.push("/logout");
  }

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-sm px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* LEFT — LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
            H
          </div>
          <span className="text-slate-200 font-semibold text-lg">
            Havenly
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white">
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition"
              >
                Get started
              </Link>
            </>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="text-slate-300 hover:text-white flex items-center gap-2"
              >
                Account
                <span className="opacity-60">▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-lg py-2">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-slate-200 text-2xl"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileOpen && (
        <div className="md:hidden mt-4 border-t border-slate-800 pt-4 animate-slide-down">
          {!user && (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="text-slate-300 hover:text-white px-2"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition w-fit"
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            </div>
          )}

          {user && (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white px-2"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                href="/settings"
                className="text-slate-300 hover:text-white px-2"
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </Link>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-300 px-2 hover:text-red-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
