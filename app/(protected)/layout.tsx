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

  if (!session?.user) {
    redirect(`/magic-login?redirectedFrom=${encodeURIComponent("/")}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header is already in RootLayout → do NOT re-render it */}
      <main>{children}</main>
    </div>
  );
}
