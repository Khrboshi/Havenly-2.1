"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
          H
        </div>
        <span className="text-slate-200 font-semibold">Havenly</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
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
          <>
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white font-medium"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
