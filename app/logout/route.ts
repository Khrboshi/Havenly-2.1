export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();

    const redirectUrl = new URL("/login?logged_out=1", request.url);

    return NextResponse.redirect(redirectUrl, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("Logout error:", err);
    const fallback = new URL("/login?error=logout_failed", request.url);
    return NextResponse.redirect(fallback);
  }
}
