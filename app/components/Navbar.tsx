"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    load();
  }, []);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-emerald-300 font-bold">
            H
          </span>
          <span className="text-sm font-semibold text-slate-100">Havenly</span>
        </Link>

        {loading ? (
          <div className="text-slate-500 text-sm">…</div>
        ) : user ? (
          // Logged-in View
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-slate-300 hover:text-white"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Log out
            </button>
          </div>
        ) : (
          // Logged-out View
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300 transition"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
