export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Supabase OAuth / Magic Link callback handler.
 * This route is hit AFTER Supabase verifies the magic link token.
 * Our job:
 * 1) Force Supabase to refresh auth cookies
 * 2) Redirect the user to the correct destination
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    // Read ?redirect_to=<path> from the magic link
    const redirectTo =
      url.searchParams.get("redirect_to") || "/dashboard";

    const supabase = await createServerSupabase();

    // Trigger cookie signing
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Callback error:", error);
    }

    // Build final redirect URL
    const final = new URL(redirectTo, url.origin);

    return NextResponse.redirect(final.toString(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Auth callback failure:", err);

    // Fail safe → return user to login page
    const fallback = new URL(
      "/magic-login?error=callback_failed",
      request.url
    );
    return NextResponse.redirect(fallback);
  }
}
