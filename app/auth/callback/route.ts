// app/auth/callback/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Handles Supabase OAuth / Magic Link callback.
 * Completes PKCE flow and populates auth cookies on the server.
 * After success → redirects user to /dashboard.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/magic-login?error=missing_code", request.url));
    }

    const supabase = await createServerSupabase();

    // Exchange the code for a session (this fixes your PKCE warning)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Callback exchange error:", error);
      return NextResponse.redirect(
        new URL("/magic-login?error=session_exchange_failed", request.url)
      );
    }

    // Session is now established; redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Callback route error:", err);
    return NextResponse.redirect(
      new URL("/magic-login?error=callback_exception", request.url)
    );
  }
}
