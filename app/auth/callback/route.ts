// app/auth/callback/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * PKCE OAuth / Magic Link callback.
 *
 * Responsibilities:
 * 1. Read the `code` from the URL that Supabase sent us.
 * 2. Let Supabase exchange that code for a session (cookies).
 * 3. Redirect the user to the final destination (default: /dashboard).
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  // Final landing page after login
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/dashboard";
  const absoluteRedirectUrl = new URL(redirectTo, origin);

  // Prepare redirect response; cookies will be mutated on this object
  let response = NextResponse.redirect(absoluteRedirectUrl, {
    headers: { "Cache-Control": "no-store" },
  });

  try {
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
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    // Supabase has attached ?code=... to this URL
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      console.error("Auth callback: missing `code` parameter");
      const failUrl = new URL(
        "/magic-login?error=missing_code",
        origin
      ).toString();
      return NextResponse.redirect(failUrl);
    }

    // Convert the code into a session (sets auth cookies on `response`)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Callback exchangeCodeForSession error:", error);
      const failUrl = new URL(
        "/magic-login?error=callback_failed",
        origin
      ).toString();
      return NextResponse.redirect(failUrl);
    }

    // Success: cookies are now set on `response`, user goes to dashboard (or redirect_to)
    return response;
  } catch (err) {
    console.error("Callback fatal error:", err);
    const failUrl = new URL(
      "/magic-login?error=callback_failed",
      origin
    ).toString();
    return NextResponse.redirect(failUrl);
  }
}
