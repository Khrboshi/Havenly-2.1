// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * This middleware ensures Supabase auth cookies are refreshed
 * on every request to protected pages.
 */
export async function middleware(req: NextRequest) {
  // Create a fresh response that updateSession can attach cookies to
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  return await updateSession(req, res);
}

/**
 * Protected routes that require the session cookie to be refreshed.
 */
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/journal",
    "/journal/:path*",
    "/tools",
    "/tools/:path*",
    "/insights",
    "/insights/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
