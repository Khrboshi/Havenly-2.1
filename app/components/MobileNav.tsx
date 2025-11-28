"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function MobileNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div
      className={`
        fixed inset-0 z-50 md:hidden
        transition-all duration-300
        ${open ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      {/* Background Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`
          absolute inset-0 bg-black/40
          transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          absolute right-0 top-0 h-full w-72
          bg-white dark:bg-slate-900
          shadow-xl
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800">
          <span className="text-lg font-semibold text-slate-900 dark:text-white">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={26} className="text-slate-700 dark:text-white" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-4 text-lg font-medium space-y-6 text-slate-800 dark:text-slate-100">
          <Link onClick={() => setOpen(false)} href="/">Home</Link>
          <Link onClick={() => setOpen(false)} href="/blog">Journal</Link>
          <Link onClick={() => setOpen(false)} href="/about">About</Link>
          <Link onClick={() => setOpen(false)} href="/tools">Tools</Link>
        </nav>
      </aside>
    </div>
  );
}
