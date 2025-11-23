import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();

  redirect("/login?logout=1");
}
