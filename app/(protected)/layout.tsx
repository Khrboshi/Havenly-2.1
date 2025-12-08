export const dynamic = "force-dynamic";

import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProtectedNavBar from "@/app/components/ProtectedNavBar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session found → redirect server-side (no flicker)
  if (!session?.user) {
    // Single entry point for login; after login we send users to /dashboard
    redirect("/magic-login");
  }

  return (
    <div>
      <ProtectedNavBar user={session.user} />
      {children}
    </div>
  );
}
