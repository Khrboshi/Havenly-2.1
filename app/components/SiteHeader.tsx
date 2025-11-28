"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

/**
 * Lightweight Havenly header — optimized for speed.
 * - Minimal JS
 * - Zero desktop re-renders
 * - Mobile menu isolated to small hydration zone
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B1120]/70 backdrop-blur-md supports-[backdrop-filter]:bg-[#0B1120]/40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo (no state, no re-render) */}
        <Link
          href="/"
          className="text-emerald-400 font-semibold text-xl tracking-tight"
        >
          Havenly
        </Link>

        {/* Desktop Nav — never hydrates, no JS, zero cost */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 select-none">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>

          <Link
            href="/magic-login"
            className="px-4 py-1.5 rounded-full border border-emerald-400/40 text-emerald-300 hover:bg-emerald-600/10 transition"
          >
            Magic Login
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-300"
          onClick={() => setOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-[#0B1120]/95 backdrop-blur-md p-6 md:hidden animate-fade-in">

          <div className="flex justify-between items-center mb-8">
            <span className="text-emerald-400 font-semibold text-xl">
              Havenly
            </span>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close Menu"
              className="text-slate-300"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="space-y-6 text-lg text-slate-200">
            <Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="block">Blog</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block">About</Link>

            <Link
              href="/magic-login"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 w-full text-center rounded-full border border-emerald-400/40 text-emerald-300 hover:bg-emerald-600/10 transition"
            >
              Magic Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
