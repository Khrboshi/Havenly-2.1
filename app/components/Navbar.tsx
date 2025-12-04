// app/components/Navbar.tsx
"use client";

import SiteHeader from "./SiteHeader";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <SiteHeader />
    </div>
  );
}
