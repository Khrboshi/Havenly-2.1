// components/SiteHeader.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/5 bg-[#040b14]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-semibold text-emerald-300">
          Havenly
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="hover:text-emerald-300">Home</Link>
          <Link href="/blog" className="hover:text-emerald-300">Blog</Link>
          <Link href="/about" className="hover:text-emerald-300">About</Link>

          <Link
            href="/magic-login"
            className="px-4 py-1.5 rounded-full border border-white/20 hover:border-emerald-300 hover:text-emerald-300 transition"
          >
            Magic Login
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-100 text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="md:hidden bg-[#040b14] border-t border-white/10 px-4 py-4 text-base space-y-4">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link
            href="/magic-login"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 rounded-full border border-white/20 text-center mt-2"
          >
            Magic Login
          </Link>
        </div>
      )}
    </header>
  );
}
