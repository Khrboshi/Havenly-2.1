// app/logout/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Logs the user out on the server and redirects them
 * back to the login page with the friendly message.
 */
export async function GET() {
  const supabase = await createServerSupabase();

  // Clears the Supabase auth session cookie (most reliable logout)
  await supabase.auth.signOut();

  // Redirect back to login with the encouraging banner
  return NextResponse.redirect("/login?logged_out=1", {
    status: 303,
  });
}
