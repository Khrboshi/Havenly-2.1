// app/(protected)/layout.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SupabaseSessionProvider } from "@/app/components/SupabaseSessionProvider";

/**
 * Protected layout:
 * - Forces dynamic rendering (no SSG)
 * - Prevents caching on server or CDN
 * - Ensures session is fresh on every request and refresh
 */
export default async function ProtectedLayout({ children }) {
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
