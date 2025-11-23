"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar({ user }: { user: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-xl font-bold text-slate-100 transition-opacity hover:opacity-70"
        >
          Havenly
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          {user && (
            <>
              <Link href="/dashboard" className="hover:text-emerald-300">
                Dashboard
              </Link>

              <Link href="/journal" className="hover:text-emerald-300">
                Journal
              </Link>

              <Link href="/settings" className="hover:text-emerald-300">
                Settings
              </Link>

              {/* ACCOUNT DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-slate-300 hover:text-emerald-300 transition"
                >
                  {/* Profile Icon SVG */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M6 21c0-4 3-6 6-6s6 2 6 6" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg animate-fade-in">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-slate-800"
                    >
                      Settings
                    </Link>

                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-sm text-red-300 hover:bg-red-900/20"
                    >
                      Log out
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <>
              <Link href="/login" className="hover:text-emerald-300">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-100"
        >
          {/* Hamburger icon */}
          <svg
            width="24"
            height="24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-4 animate-slide-down">

          {user && (
            <>
              <Link href="/dashboard" className="block" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/journal" className="block" onClick={() => setMenuOpen(false)}>
                Journal
              </Link>
              <Link href="/settings" className="block" onClick={() => setMenuOpen(false)}>
                Settings
              </Link>

              <Link
                href="/logout"
                className="block text-red-300"
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link href="/login" className="block" onClick={() => setMenuOpen(false)}>
                Login
              </Link>

              <Link
                href="/signup"
                className="block px-4 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold text-center"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
