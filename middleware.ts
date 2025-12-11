// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware keeps Supabase auth cookies refreshed.
 * It must run on ALL protected routes AND their subpaths,
 * and also on "/" with trailing slash variations.
 */
export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

/**
 * CRITICAL:
 * This matcher ensures cookies refresh on:
 * - /dashboard and all subroutes
 * - /journal and all subroutes
 * - /tools and all subroutes
 * - /insights and all subroutes
 * - /settings and all subroutes
 *
 * AND also enforces unified origin handling (important for Vercel).
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/settings/:path*",
    
    // These ensure Vercel’s "/" and "/index" variations don’t break cookies
    "/((?:[^/]+/)*[^.]*$)",
  ],
};
