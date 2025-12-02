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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Compute full URL user is trying to visit
  const targetUrl =
    typeof window !== "undefined"
      ? window.location.pathname
      : ""; // server fallback

  if (!session?.user) {
    redirect(
      `/magic-login?redirectedFrom=${encodeURIComponent(targetUrl || "/")}`
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Protected content */}
      <main>{children}</main>
    </div>
  );
}
