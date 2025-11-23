"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

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
    await supabaseClient.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
      
      {/* LEFT — Logo */}
      <Link
        href={user ? "/dashboard" : "/"}
        className="flex items-center gap-2 group transition"
      >
        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold group-hover:opacity-70 transition-opacity">
          H
        </div>
        <span className="text-slate-200 font-semibold group-hover:opacity-70 transition-opacity">
          Havenly
        </span>
      </Link>

      {/* RIGHT — Login / Register if logged out */}
      {!user && (
        <div className="flex items-center gap-4">
          <Link href="/login" className="nav-btn">
            Log in
          </Link>
          <Link href="/signup" className="nav-primary-btn">
            Get started
          </Link>
        </div>
      )}

      {/* RIGHT — User dropdown if logged in */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-4 py-2 rounded-xl"
          >
            <span className="text-slate-200 text-sm">
              {user.email?.split("@")[0]}
            </span>
            <span className="text-slate-400">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-2 flex flex-col text-sm">
              <Link
                href="/dashboard"
                className="dropdown-item"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                href="/settings"
                className="dropdown-item"
                onClick={() => setOpen(false)}
              >
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
    </nav>
  );
}
