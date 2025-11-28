"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-semibold text-emerald-400">
          Havenly
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-slate-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-emerald-400 transition ${
                pathname === link.href ? "text-emerald-400" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/auth/login"
            className="px-4 py-1.5 rounded-full border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 transition"
          >
            Magic Login
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-200"
          onClick={() => setOpen(!open)}
        >
          <span className="text-xl">≡</span>
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {open && (
        <div className="md:hidden bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/60 px-4 pb-4">
          <nav className="flex flex-col text-slate-200 gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`hover:text-emerald-400 transition ${
                  pathname === link.href ? "text-emerald-400" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="w-full text-center px-4 py-2 rounded-full border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 transition"
            >
              Magic Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
