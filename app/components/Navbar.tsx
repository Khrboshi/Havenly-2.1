"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar({ user: initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep auth synced (fixes logout refresh problem)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await supabaseClient.auth.signOut();
    router.replace("/login?logged_out=1");
  }

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 
            ring-1 ring-emerald-400/40 text-emerald-300 font-semibold text-sm">
            H
          </div>
          <span className="text-sm font-semibold text-slate-100">Havenly</span>
        </Link>

        {/* Right Side */}
        {!user ? (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-300 hover:text-emerald-200">Log in</Link>
            <Link href="/signup" className="rounded-full bg-emerald-400 px-4 py-2 text-sm text-slate-950 hover:bg-emerald-300">
              Get started
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-300 hover:text-emerald-200">Dashboard</Link>
            <Link href="/journal" className="text-sm text-slate-300 hover:text-emerald-200">Journal</Link>
            <Link href="/settings" className="text-sm text-slate-300 hover:text-emerald-200">Settings</Link>

            <button
              onClick={handleLogout}
              className="rounded-full bg-slate-900/60 px-3 py-1.5 text-xs text-rose-300 ring-1 ring-slate-700 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
