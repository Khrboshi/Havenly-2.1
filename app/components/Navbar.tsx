// app/components/Navbar.tsx
"use client";

import SiteHeader from "./SiteHeader";

/**
 * Thin wrapper around the main header.
 * Kept separate for clarity and future extension.
 */
export default function Navbar() {
  return (
    <div className="w-full border-b border-slate-800 bg-slate-900/70 backdrop-blur-md">
      <SiteHeader />
    </div>
  );
}
