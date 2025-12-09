"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";

export default function Navbar() {
  const { supabase } = useSupabase();

  const [planType, setPlanType] = useState<string>("FREE");
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      const res = await fetch("/api/user/plan");
      const data = await res.json();

      if (data?.plan) {
        setPlanType(data.plan.planType);
        setCredits(data.plan.credits);
      }

      setLoading(false);
    }

    loadPlan();
  }, []);

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold text-brand-primary">
        Havenly
      </Link>

      {!loading && (
        <div className="flex items-center gap-6">
          {/* Plan + Credits Display */}
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{planType}</span>

            {planType === "FREE" && (
              <span className="ml-1">· {credits}/20 reflections left</span>
            )}

            {planType !== "FREE" && (
              <span className="ml-1 text-green-700">· Premium Access</span>
            )}
          </div>

          {/* Upgrade CTA for Free Users */}
          {planType === "FREE" && (
            <Link
              href="/upgrade"
              className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark text-sm transition"
            >
              Upgrade
            </Link>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-4 text-gray-700">
            <Link href="/journal">Journal</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/insights">Insights</Link>
          </div>

          {/* Logout */}
          <Link
            href="/logout"
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
