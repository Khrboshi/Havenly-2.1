// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import SiteHeader from "@/app/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  // Fetch session — SERVER-SIDE (correct, stable)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // No session → redirect to magic login with return path
  if (!session?.user) {
    redirect(`/magic-login?redirectedFrom=${encodeURIComponent("/")}`);
  }

  // Authenticated → render protected area
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Global navbar that now works consistently */}
      <SiteHeader />

      {/* Protected content area */}
      <main>{children}</main>
    </div>
  );
}
