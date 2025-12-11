// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * This middleware keeps Supabase auth cookies in sync on protected routes.
 * It NEVER touches public routes or OAuth callbacks.
 */
export function updateSession(request: NextRequest) {
  // Base response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase server client with COOKIE PASSTHROUGH
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
          response.cookies.delete(name);
        },
      },
    }
  );

  return { supabase, response };
}
