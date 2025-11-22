"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    loadUser();

    // Listen for logins / logouts to update in real-time
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md py-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-400 flex items-center justify-center text-slate-900 font-bold">
            H
          </div>
          Havenly
        </Link>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-slate-400 text-sm">…</div>
        ) : user ? (
          // LOGGED IN
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white text-sm font-medium"
            >
              Dashboard
            </Link>

            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          // LOGGED OUT
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-medium"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-medium text-slate-950 hover:bg-emerald-300 transition"
            >
              Get started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
