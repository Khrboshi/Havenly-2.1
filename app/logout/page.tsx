import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function LogoutPage() {
  const supabase = createServerSupabase();

  // Server-side sign out (clears cookies for middleware & SSR)
  await supabase.auth.signOut();

  // Redirect to landing with a friendly toast
  redirect("/?message=logged_out");
}
