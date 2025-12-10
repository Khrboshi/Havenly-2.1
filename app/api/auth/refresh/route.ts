// app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Correct PKCE-compatible refresh route.
 *
 * - Reads cookies from the incoming request
 * - Recreates the Supabase server client with those cookies
 * - Calls getSession() to force cookie re-signing
 * - Returns updated cookies in the response
 *
 * This prevents the "exchangeCodeForSession" PKCE error
 * and ensures server APIs (like /api/user/plan) always receive
 * a valid session.
 */

export async function POST(request: NextRequest) {
  // Create initial response
  let response = NextResponse.json({ ok: true });

  // Create Supabase server client with proper cookie passthrough
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

  // Trigger Supabase to re-sign cookies for PKCE sessions
  await supabase.auth.getSession();

  return response;
}
