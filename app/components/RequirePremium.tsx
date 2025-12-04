"use client";

import { ReactNode } from "react";
import { useUserPlan } from "./useUserPlan";
import Link from "next/link";

export default function RequirePremium({ children }: { children: ReactNode }) {
  const { authenticated, premium, planType } = useUserPlan();

  // Loading or unauthenticated
  if (!authenticated) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-lg font-semibold mb-4">Please sign in</p>
        <Link
          href="/magic-login"
          className="inline-block px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400"
        >
          Sign in
        </Link>
      </div>
    );
  }

  // Free or wrong plan
  if (!premium) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Premium Feature</h2>
        <p className="text-white/80 max-w-sm mb-6">
          This feature is available only to Havenly Premium members.  
          Upgrade now to unlock full access.
        </p>
        <Link
          href="/upgrade"
          className="px-5 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400"
        >
          Upgrade to Premium
        </Link>
      </div>
    );
  }

  // Premium — show content
  return <>{children}</>;
}
