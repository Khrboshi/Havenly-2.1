"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.replace("/");
  }

  // navbar renders differently depending on login state
  const isLoggedIn = !!session?.user;
  const userEmail = session?.user?.email || "";

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-slate-100">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-900 font-bold">
            H
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Havenly
          </span>
        </Link>

        {/* Right side buttons */}
        {!loading && (
          <div className="flex items-center gap-4">

            {/* Logged-out view */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 text-sm hover:text-white"
                >
                  Log in
                </Link>

                <button
                  onClick={() => router.push("/magic-login")}
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  Start journaling free
                </button>
              </>
            )}

            {/* Logged-in view */}
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Dashboard
                </Link>

                <Link
                  href="/journal"
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Journal
                </Link>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Premium (coming soon)
                </span>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-200">
                  {userEmail}
                </span>

                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Log out
                </button>
              </>
            )}

          </div>
        )}
      </div>
    </nav>
  );
}
