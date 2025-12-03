// app/(protected)/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import SessionHeartbeat from "@/app/components/auth/SessionHeartbeat";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  // Correct server-side session check
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session → redirect safely
  if (!session) {
    redirect("/magic-login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 🔥 Keep the Supabase session alive */}
      <SessionHeartbeat />

      <main>{children}</main>
    </div>
  );
}
