export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Handles Supabase OAuth/Magic Link callback.
 * Supabase hits this URL after validating the user's token.
 * We only need to refresh session cookies and redirect.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();

    // Force Supabase to refresh cookies (PKCE-safe)
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Callback session error:", error);
    }

    // Redirect to dashboard after successful auth
    const redirectUrl = new URL("/dashboard", request.url);

    return NextResponse.redirect(redirectUrl, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Auth callback failure:", err);

    // Fallback redirect if anything fails
    const fallback = new URL("/magic-login?error=callback_failed", request.url);
    return NextResponse.redirect(fallback);
  }
}
