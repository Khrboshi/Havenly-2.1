"use client";

import { useSupabase } from "@/app/components/SupabaseSessionProvider";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  const { session } = useSupabase();

  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-slate-200">
        <h1 className="text-xl font-semibold mb-4">Loading your dashboard…</h1>
        <p className="text-slate-400">Please wait a moment.</p>
      </div>
    );
  }

  return <DashboardClient userId={userId} />;
}
