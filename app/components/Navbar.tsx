// app/components/Navbar.tsx
"use client";

import SiteHeader from "./SiteHeader";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <SiteHeader />
    </header>
  );
}
