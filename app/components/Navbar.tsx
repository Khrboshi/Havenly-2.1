"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // -----------------------------
  // AUTH STATE LISTENER
  // -----------------------------
  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh();
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // -----------------------------
  // LOGOUT HANDLER
  // -----------------------------
  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.push("/logout");
    router.refresh();
    setMobileOpen(false);
  }

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-900 group-hover:opacity-80 transition">
            H
          </div>
          <span className="text-slate-200 font-semibold group-hover:opacity-80 transition">
            Havenly
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
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
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-900 font-medium hover:bg-emerald-400 transition"
              >
                Get started
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                >
                  Account <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-lg animate-fade-in">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-t-xl"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-b-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-slate-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 animate-slide-down">
          <div className="px-4 py-4 flex flex-col gap-4">

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-200 text-lg"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-xl font-medium text-center"
                >
                  Get started
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-200 text-lg"
                >
                  Dashboard
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-200 text-lg"
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-slate-200 text-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
