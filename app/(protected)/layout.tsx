export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import SessionHeartbeat from "@/app/components/auth/SessionHeartbeat";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {

  // 🚫 Prevent this layout from running on /magic-login accidentally
  // If this layout somehow gets applied, escape early
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/magic-login")) return <>{children}</>;
  }

  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/magic-login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SessionHeartbeat />
      <main>{children}</main>
    </div>
  );
}
