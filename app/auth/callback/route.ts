export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Correct PKCE OAuth/Magic Link callback route.
 * Handles cookie passthrough + session exchange + redirect.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Final destination (defaults to /dashboard)
    const redirectTo = url.searchParams.get("redirect_to") || "/dashboard";

    // Prepare response early, we will mutate cookies inside Supabase adapter
    let response = NextResponse.redirect(redirectTo, {
      headers: { "Cache-Control": "no-store" },
    });

    // Create Supabase server client WITH COOKIE PASSTHROUGH (required!)
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

    // Force Supabase to exchange the token in the URL for a session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Callback session exchange error:", error);
    }

    return response;
  } catch (err) {
    console.error("Callback fatal error:", err);
    return NextResponse.redirect("/magic-login?error=callback_failed");
  }
}
