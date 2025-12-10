// app/(protected)/layout.tsx
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SupabaseSessionProvider } from "@/app/components/SupabaseSessionProvider";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session → redirect to login
  if (!session?.user) {
    redirect("/magic-login");
  }

  return (
    <SupabaseSessionProvider initialSession={session}>
      {children}
    </SupabaseSessionProvider>
  );
}
