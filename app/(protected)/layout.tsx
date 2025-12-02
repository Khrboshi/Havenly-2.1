// app/(protected)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SupabaseSessionProvider } from "@/app/components/SupabaseSessionProvider";
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

  // Extract pathname safely from headers on the server.
  // This avoids using "window" which is undefined in SSR.
  const referer = headers().get("x-pathname") ?? "/";

  if (!session?.user) {
    redirect(
      `/magic-login?redirectedFrom=${encodeURIComponent(referer)}`
    );
  }

  return (
    <SupabaseSessionProvider>
      {/* Protected Navigation */}
      <ProtectedNavBar />

      {/* Protected content container */}
      <main className="min-h-screen bg-slate-950 text-white pt-20">
        {children}
      </main>
    </SupabaseSessionProvider>
  );
}
