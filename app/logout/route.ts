export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();

    // Destroy the session
    await supabase.auth.signOut();

    // Create absolute redirect URL
    const url = new URL("/login?logged_out=1", request.url);

    return NextResponse.redirect(url);
  } catch (err) {
    console.error("Logout error:", err);

    const fallback = new URL("/login?error=logout_failed", request.url);
    return NextResponse.redirect(fallback);
  }
}
