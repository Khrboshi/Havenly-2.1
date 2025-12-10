"use client";

import { useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { session } = useSupabase();
  const user = session?.user || null;

  const loggedIn = Boolean(user);

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* LEFT — BRAND */}
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-slate-100"
        >
          HAVENLY
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-6 md:flex">
          {!loggedIn && (
            <>
              <Link
                href="/"
                className="text-sm text-slate-300 hover:text-white transition"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="text-sm text-slate-300 hover:text-white transition"
              >
                About
              </Link>

              <Link
                href="/blog"
                className="text-sm text-slate-300 hover:text-white transition"
              >
                Blog
              </Link>

              <Link
                href="/magic-login"
                className="text-sm text-slate-300 hover:text-white transition"
              >
                Log in
              </Link>

              <Link
                href="/magic-login"
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
              >
                Start free journal
              </Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white">
                Dashboard
              </Link>

              <Link href="/journal" className="text-sm text-slate-300 hover:text-white">
                Journal
              </Link>

              <Link href="/tools" className="text-sm text-slate-300 hover:text-white">
                Tools
              </Link>

              <Link href="/insights" className="text-sm text-slate-300 hover:text-white">
                Insights
              </Link>

              <Link
                href="/upgrade"
                className="rounded-full border border-emerald-400 px-4 py-1.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10 transition"
              >
                Upgrade
              </Link>

              <Link
                href="/logout"
                className="text-sm text-slate-400 hover:text-red-400 transition"
              >
                Logout
              </Link>
            </>
          )}
        </div>

        {/* MOBILE — BURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-800 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-4 md:hidden animate-slideDown">
          <div className="flex flex-col gap-4">

            {!loggedIn && (
              <>
                <Link href="/" onClick={() => setOpen(false)} className="text-slate-200">
                  Home
                </Link>

                <Link href="/about" onClick={() => setOpen(false)} className="text-slate-200">
                  About
                </Link>

                <Link href="/blog" onClick={() => setOpen(false)} className="text-slate-200">
                  Blog
                </Link>

                <Link href="/magic-login" onClick={() => setOpen(false)} className="text-slate-200">
                  Log in
                </Link>

                <Link
                  href="/magic-login"
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full rounded-full bg-emerald-500 px-4 py-2 text-center font-semibold text-slate-950"
                >
                  Start free journal
                </Link>
              </>
            )}

            {loggedIn && (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-slate-200">
                  Dashboard
                </Link>

                <Link href="/journal" onClick={() => setOpen(false)} className="text-slate-200">
                  Journal
                </Link>

                <Link href="/tools" onClick={() => setOpen(false)} className="text-slate-200">
                  Tools
                </Link>

                <Link href="/insights" onClick={() => setOpen(false)} className="text-slate-200">
                  Insights
                </Link>

                <Link href="/upgrade" onClick={() => setOpen(false)} className="text-emerald-300">
                  Upgrade
                </Link>

                <Link
                  href="/logout"
                  onClick={() => setOpen(false)}
                  className="mt-3 text-red-400"
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
