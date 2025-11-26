export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();

    const redirectUrl = new URL("/magic-login?logged_out=1", request.url);

    return NextResponse.redirect(redirectUrl.toString(), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Logout error:", err);
    const fallback = new URL("/magic-login?error=logout_failed", request.url);
    return NextResponse.redirect(fallback.toString());
  }
}
