"use client";

import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-white/10 bg-[var(--brand-surface)]/40 backdrop-blur-sm animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold">
            H
          </div>
          <span className="text-lg font-semibold text-[var(--brand-primary-light)]">
            Havenly
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/" className="hover:text-[var(--brand-primary)]">
            Home
          </Link>
          <Link href="/journal" className="hover:text-[var(--brand-primary)]">
            Journal
          </Link>
          <Link href="/about" className="hover:text-[var(--brand-primary)]">
            About
          </Link>
          <Link href="/tools" className="hover:text-[var(--brand-primary)]">
            Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
