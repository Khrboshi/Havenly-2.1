"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  // 1️⃣ Load user + subscribe to auth changes
  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      setUser(user);
    }

    load();

    // Subscribe to login/logout events
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh(); // force component re-render
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // 2️⃣ Re-render navbar on page change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 3️⃣ Dashboard button always forces navigation
  function gotoDashboard() {
    router.push("/dashboard");
    router.refresh();
  }

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <button
        onClick={() => {
          user ? gotoDashboard() : router.push("/");
        }}
        className="flex items-center gap-2 group cursor-pointer"
      >
        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold group-hover:opacity-70 transition-opacity">
          H
        </div>
        <span className="text-slate-200 font-semibold group-hover:opacity-70 transition-opacity">
          Havenly
        </span>
      </button>

      {/* Logged-out buttons */}
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

      {/* Logged-in dropdown */}
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
              <button
                onClick={gotoDashboard}
                className="dropdown-item"
              >
                Dashboard
              </button>

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
