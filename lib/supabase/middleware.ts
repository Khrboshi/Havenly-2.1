// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * updateSession
 *
 * Runs in Next.js middleware and keeps Supabase auth cookies
 * in sync on every request that matches the middleware config.
 *
 * - Reads cookies from the incoming request
 * - Creates a Supabase server client with cookie passthrough
 * - Calls auth.getSession() so Supabase can refresh / rotate tokens
 * - Writes any updated cookies onto the NextResponse
 */
export async function updateSession(request: NextRequest) {
  // Start with a "pass through" response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
          // Properly clear the cookie on this domain/path
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // This is the important part:
  // it forces Supabase to read existing cookies, refresh tokens
  // if needed, and write back any changes via the cookie adapter.
  await supabase.auth.getSession();

  return { supabase, response };
}
