"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleNavClick = (href: string) => {
    router.push(href);
    router.refresh();        // ← Forces UI to reload session state
    setOpen(false);
  };

  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <button
          onClick={() => handleNavClick("/")}
          className="text-xl font-semibold text-white hover:opacity-80 transition"
        >
          Havenly
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => handleNavClick("/dashboard")}>Dashboard</button>
          <button onClick={() => handleNavClick("/journal")}>Journal</button>
          <button onClick={() => handleNavClick("/settings")}>Settings</button>
          <button
            onClick={() => handleNavClick("/logout")}
            className="rounded-full border border-slate-700 px-4 py-1 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden flex flex-col bg-slate-900 border-t border-slate-800 px-4 py-3">
          <button onClick={() => handleNavClick("/dashboard")} className="py-2">
            Dashboard
          </button>
          <button onClick={() => handleNavClick("/journal")} className="py-2">
            Journal
          </button>
          <button onClick={() => handleNavClick("/settings")} className="py-2">
            Settings
          </button>
          <button
            onClick={() => handleNavClick("/logout")}
            className="py-2 text-red-400"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
