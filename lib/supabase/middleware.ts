// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * updateSession
 *
 * Runs on every request that matches `middleware.ts`'s matcher.
 * Responsibilities:
 * - Recreate the Supabase server client with full cookie passthrough
 * - Call auth.getUser() so Supabase can refresh / re-sign the session cookies
 * - Return the (optionally refreshed) response back to the Next.js middleware
 */
export async function updateSession(request: NextRequest) {
  // Start with a "pass-through" response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client wired to request/response cookies
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
        remove(name: string) {
          // Next.js 14: delete() takes only the name
          response.cookies.delete(name);
        },
      },
    }
  );

  // IMPORTANT:
  // Trigger a user lookup so Supabase can refresh the auth cookies.
  // Without this, sessions may appear to "drop" on hard reloads.
  const { error } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase middleware getUser error:", error.message);
    // Do NOT redirect here; ProtectedLayout handles unauthenticated users.
  }

  return { supabase, response };
}
