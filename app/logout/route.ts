export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();

    // FULL logout: clears access + refresh tokens
    await supabase.auth.signOut();

    // Also manually clear cookies for safety
    const response = NextResponse.redirect(
      new URL("/magic-login?logged_out=1", request.url)
    );

    response.cookies.set("sb-access-token", "", {
      path: "/",
      expires: new Date(0),
    });

    response.cookies.set("sb-refresh-token", "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.redirect(
      new URL("/magic-login?error=logout_failed", request.url)
    );
  }
}
