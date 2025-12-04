// app/components/Navbar.tsx
"use client";

import SiteHeader from "./SiteHeader";
import { useUserPlan } from "./useUserPlan";

export default function Navbar() {
  const { loading, planType, credits } = useUserPlan();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
      {/* Main nav (logo + links + upgrade + plan status) */}
      <SiteHeader
        accountStatus={
          loading
            ? "Checking account…"
            : planType
            ? `${planType === "PREMIUM" ? "Premium" : "Free"} · ${
                typeof credits === "number" ? `Credits: ${credits}` : ""
              }`
            : "Not signed in"
        }
      />
    </header>
  );
}
