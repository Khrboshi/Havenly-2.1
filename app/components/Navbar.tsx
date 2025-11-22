"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabaseClient.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/"; // force reset
  }

  return (
    <header className="w-full border-b border-slate-800/50 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-900 font-bold">
            H
          </div>
          <span className="text-slate-100 font-semibold">Havenly</span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-4">
          {loading ? (
            <span className="text-slate-400 text-sm">...</span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-slate-100 hover:text-emerald-300 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-slate-300 hover:text-red-400 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-200 hover:text-emerald-300"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400 transition"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
