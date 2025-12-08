"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md fixed top-0 left-0 z-50">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-slate-200">

        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          Havenly
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/magic-login" className="text-sm">
            Sign in
          </Link>

          <Link
            href="/upgrade"
            className="px-4 py-2 rounded-full bg-emerald-400 text-slate-900 text-sm font-semibold hover:bg-emerald-300"
          >
            Try Premium
          </Link>
        </div>
      </nav>
    </header>
  );
}
