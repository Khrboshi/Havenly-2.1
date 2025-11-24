import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    // Clear session server-side
    await supabase.auth.signOut();

    // Redirect user to login with the logout notice
    return NextResponse.redirect("/login?logged_out=1");
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.redirect("/login?error=logout_failed");
  }
}
