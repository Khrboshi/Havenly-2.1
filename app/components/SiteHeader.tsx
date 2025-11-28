"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MobileNav from "./MobileNav";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="
          w-full z-40
          backdrop-blur-xl bg-white/60 dark:bg-slate-900/40
          border-b border-white/20 dark:border-slate-800/40
          shadow-sm
          animate-fade-in
        "
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Left Links (Desktop) */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-200">
            <Link href="/" className="hover:text-emerald-600 transition">Home</Link>
            <Link href="/blog" className="hover:text-emerald-600 transition">Journal</Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Havenly
          </Link>

          {/* Right Links (Desktop) */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-200">
            <Link href="/about" className="hover:text-emerald-600 transition">About</Link>
            <Link href="/tools" className="hover:text-emerald-600 transition">Tools</Link>
          </nav>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-slate-700 dark:text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      <MobileNav open={open} setOpen={setOpen} />
    </>
  );
}
