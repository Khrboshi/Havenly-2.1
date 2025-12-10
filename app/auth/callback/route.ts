export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Correct PKCE OAuth/Magic Link callback route.
 * Handles cookie passthrough + session exchange + redirect.
 */
export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);

    // Determine final landing page
    const redirectTo =
      requestUrl.searchParams.get("redirect_to") || "/dashboard";

    // Build an ABSOLUTE redirect URL (required by Next.js 14 route handlers)
    const absoluteRedirectUrl = new URL(redirectTo, requestUrl.origin).toString();

    // Prepare early response (cookies will be mutated via Supabase client)
    let response = NextResponse.redirect(absoluteRedirectUrl, {
      headers: { "Cache-Control": "no-store" },
    });

    // Create Supabase server client with COOKIE PASSTHROUGH
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

    // Trigger session exchange (causes Supabase to read the ?code= param)
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error("Callback session exchange error:", error);
    }

    return response;
  } catch (err) {
    console.error("Callback fatal error:", err);

    // ABSOLUTE fallback URL – avoids "URL is malformed" crash
    const origin =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_SITE_URL || "https://havenly-2-1.vercel.app"
        : window.location.origin;

    const failUrl = new URL("/magic-login?error=callback_failed", origin).toString();

    return NextResponse.redirect(failUrl);
  }
}
