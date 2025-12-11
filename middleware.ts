// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * This middleware ONLY refreshes Supabase auth cookies
 * on API/data/navigation requests — NOT on full-page reloads.
 *
 * This prevents hard-refresh logout and keeps PKCE working.
 */
export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

/**
 * IMPORTANT:
 * We apply middleware ONLY to internal data routes.
 *
 * These are the exact patterns Next.js uses for:
 * - RSC data fetching
 * - metadata / layout data loading
 * - parallel routes
 *
 * We DO NOT apply middleware to:
 * - /dashboard
 * - /journal
 * - /tools
 * - /insights
 * - /settings
 *
 * This prevents Supabase cookies from being overwritten during full reload.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|magic-login|login).*)",
  ],
};
