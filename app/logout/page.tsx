// app/logout/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LogoutPage() {
  const supabase = createServerSupabase();

  try {
    await supabase.auth.signOut();
  } catch {
    // ignore if already logged out
  }

  // Back to landing page after logout
  redirect("/");
}
