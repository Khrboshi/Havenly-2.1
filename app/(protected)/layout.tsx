// app/(protected)/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

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

  // If no session → redirect safely (no SSR errors)
  if (!session) {
    redirect("/magic-login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main>{children}</main>
    </div>
  );
}
