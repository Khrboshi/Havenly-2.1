"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user ?? null);
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* LEFT — LOGO */}
      <Link
        href="/"
        className="flex items-center gap-2 group transition"
      >
        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold group-hover:opacity-80 transition">
          H
        </div>
        <span className="text-slate-200 font-semibold group-hover:text-white transition">
          Havenly
        </span>
      </Link>

      {/* RIGHT — NAVIGATION */}
      <div className="flex items-center gap-6 relative">
        {!user && (
          <>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition"
            >
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
          <>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            >
              {user.email?.split("@")[0]}
              <span className="opacity-60 text-xs">▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
