"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";

export default function DashboardPage() {
  const { supabase } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState<string>("FREE");
  const [credits, setCredits] = useState<number>(0);

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-brand-text">Dashboard</h1>

      {!loading && (
        <div className="p-5 bg-white border shadow-sm rounded-xl space-y-2">
          <p className="text-lg font-semibold text-gray-900">
            Your Plan: <span className="text-brand-primary">{planType}</span>
          </p>

          {planType === "FREE" ? (
            <p className="text-gray-700">
              You have <strong>{credits}/20</strong> AI reflections remaining
              this month.
            </p>
          ) : (
            <p className="text-green-700 font-medium">
              Premium access active — enjoy deeper insights, unlimited tools,
              and priority reflection quality.
            </p>
          )}

          {planType === "FREE" && (
            <Link
              href="/upgrade"
              className="inline-block mt-3 px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark transition"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 pt-4">
        <Link
          href="/journal"
          className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Journal</h3>
          <p className="text-gray-600 text-sm">
            Write entries and reflect on your day.
          </p>
        </Link>

        <Link
          href="/tools"
          className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Tools</h3>
          <p className="text-gray-600 text-sm">
            AI-powered utilities to improve your emotional clarity.
          </p>
        </Link>

        <Link
          href="/insights"
          className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Insights</h3>
          <p className="text-gray-600 text-sm">
            Understand patterns and trends over time.
          </p>
        </Link>
      </div>
    </div>
  );
}
