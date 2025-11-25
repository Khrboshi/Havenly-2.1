export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabase();

    // Clear session at Supabase level
    await supabase.auth.signOut();

    // Redirect to login with message
    const redirectUrl = new URL("/login?logged_out=1", req.url);
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("Logout error:", err);

    const fallback = new URL("/login?error=logout_failed", req.url);
    return NextResponse.redirect(fallback.toString());
  }
}
