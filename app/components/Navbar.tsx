"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load current user and subscribe to auth changes
  useEffect(() => {
    let isMounted = true;

    supabaseClient.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setUser(null);
        } else {
          setUser(data?.user ?? null);
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  const homeHref = user ? "/dashboard" : "/";

  async function handleLogout() {
    setMobileOpen(false);

    // Optimistic update so navbar changes immediately
    setUser(null);

    // Client sign-out (updates Supabase client state)
    try {
      await supabaseClient.auth.signOut();
    } catch {
      // ignore
    }

    // Let the /logout page handle server-side sign-out + redirect + toast
    router.push("/logout");
  }

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo / brand */}
        <button
          onClick={() => router.push(homeHref)}
          className="flex items-center gap-2 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-slate-950 group-hover:opacity-80 transition-opacity">
            {user?.email?.[0]?.toUpperCase() ?? "H"}
          </div>
          <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
            Havenly
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={
                  "hover:text-emerald-300 transition-colors" +
                  (isActive("/dashboard") ? " text-emerald-300" : "")
                }
              >
                Dashboard
              </Link>
              <Link
                href="/journal"
                className={
                  "hover:text-emerald-300 transition-colors" +
                  (isActive("/journal") ? " text-emerald-300" : "")
                }
              >
                Journal
              </Link>
              <Link
                href="/settings"
                className={
                  "hover:text-emerald-300 transition-colors" +
                  (isActive("/settings") ? " text-emerald-300" : "")
                }
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-600 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-100 hover:text-emerald-300 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-emerald-300 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-4 rounded bg-slate-200" />
            <span className="block h-0.5 w-4 rounded bg-slate-200" />
          </div>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden animate-slide-down">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-3 text-sm gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={
                    "py-1.5 hover:text-emerald-300 transition-colors" +
                    (isActive("/dashboard") ? " text-emerald-300" : "")
                  }
                >
                  Dashboard
                </Link>
                <Link
                  href="/journal"
                  onClick={() => setMobileOpen(false)}
                  className={
                    "py-1.5 hover:text-emerald-300 transition-colors" +
                    (isActive("/journal") ? " text-emerald-300" : "")
                  }
                >
                  Journal
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className={
                    "py-1.5 hover:text-emerald-300 transition-colors" +
                    (isActive("/settings") ? " text-emerald-300" : "")
                  }
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-full border border-slate-700 px-4 py-1.5 text-left text-xs font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 hover:text-emerald-300 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-medium text-slate-950 text-center hover:bg-emerald-300 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
