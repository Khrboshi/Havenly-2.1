// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import ProtectedNavBar from "@/app/components/ProtectedNavBar";

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

  // Extract pathname from request headers
  const hdrs = headers();
  const referer = hdrs.get("x-pathname") ?? "/";

  if (!session?.user) {
    redirect(`/magic-login?redirectedFrom=${encodeURIComponent(referer)}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ProtectedNavBar />
      <main className="pt-20">{children}</main>
    </div>
  );
}
