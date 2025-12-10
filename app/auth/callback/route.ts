export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Correct PKCE OAuth/Magic Link callback route.
 * This MUST:
 * 1. Pass the Supabase token from the URL
 * 2. Let Supabase exchange it for a session
 * 3. Write the session cookies
 * 4. Redirect cleanly to the final destination
 */

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  // Where the user should ultimately land
  const redirectTo =
    url.searchParams.get("redirect_to") || "/dashboard";

  let response = NextResponse.redirect(redirectTo, {
    headers: { "Cache-Control": "no-store" },
  });

  // Create Supabase client with cookie passthrough
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

  try {
    // IMPORTANT:
    // This exchanges the PKCE token for a session,
    // which writes the auth cookies.
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Supabase callback error:", error);
      return NextResponse.redirect(
        `${url.origin}/magic-login?error=callback_failed`
      );
    }

    return response;
  } catch (err) {
    console.error("Callback failure:", err);
    return NextResponse.redirect(
      `${url.origin}/magic-login?error=callback_failed`
    );
  }
}
