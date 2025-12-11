// app/(protected)/layout.tsx

import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SupabaseSessionProvider } from "@/app/components/SupabaseSessionProvider";

/**
 * IMPORTANT:
 * We REMOVE "force-dynamic" because it caused
 * Supabase cookies to refresh incorrectly on hard reload,
 * which logged the user out.
 *
 * Protected routes can safely use default caching,
 * since middleware keeps auth cookies synced.
 */

export const revalidate = 0; // no static caching; safe + stable

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login");
  }

  return (
    <SupabaseSessionProvider initialSession={session}>
      {children}
    </SupabaseSessionProvider>
  );
}
