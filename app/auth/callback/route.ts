export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase Auth callback (PKCE-compatible).
 *
 * Supabase sends the user here with a `code` in the URL.
 * We must:
 *  - exchange that code for a session
 *  - write auth cookies on the response
 *  - then redirect the user to their final destination (/dashboard by default)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  // PKCE auth code from Supabase
  const code = requestUrl.searchParams.get("code");

  // Optional final destination passed from sendMagicLink
  const redirectToParam = requestUrl.searchParams.get("redirect_to") || "/dashboard";

  // Default response is a redirect to the final destination
  let response = NextResponse.redirect(
    new URL(redirectToParam, requestUrl.origin),
    {
      headers: { "Cache-Control": "no-store" },
    }
  );

  // If there is no code, just go to the redirect target (user will still be unauthenticated)
  if (!code) {
    return response;
  }

  // Create Supabase server client wired to this request + response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          // Clear cookie
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Exchange the code for a session and write cookies
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase exchangeCodeForSession error:", error);

    // Fall back to magic-login with error information
    const fallback = new URL(
      "/magic-login?error=callback_failed",
      requestUrl.origin
    );
    return NextResponse.redirect(fallback, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Success: cookies now contain a valid session, proceed to dashboard (or redirect_to)
  return response;
}
