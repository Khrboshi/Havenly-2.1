// lib/supabase/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

/**
 * Updates Supabase session and ensures cookies persist correctly.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createMiddlewareClient({
    req: request,
    res: response,
  });

  // This automatically refreshes session + cookies
  await supabase.auth.getSession();

  return { response };
}
