"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <header className="w-full border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-40">
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-emerald-400 font-semibold text-xl">
          Havenly
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8 text-slate-300 text-sm">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link
            href="/magic-login"
            className="px-4 py-1.5 rounded-full border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 transition"
          >
            Magic Login
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0B1120] border-t border-white/5 px-4 pb-6 pt-4 space-y-4 text-slate-200 text-base">
          <Link href="/" className="block" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/blog" className="block" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/about" className="block" onClick={() => setOpen(false)}>About</Link>
          <Link
            href="/magic-login"
            onClick={() => setOpen(false)}
            className="inline-block w-full text-center px-4 py-2 rounded-full border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 transition"
          >
            Magic Login
          </Link>
        </div>
      )}
    </header>
  );
}
