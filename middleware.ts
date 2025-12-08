// middleware.ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware is now responsible ONLY for:
 * - Letting Supabase sync auth cookies (via updateSession)
 * - Not for deciding if a user is allowed to see a page
 *
 * Route protection is handled in the (protected) layout/pages.
 */
export async function middleware(request: NextRequest) {
  // Always call updateSession so Supabase can:
  // - Read magic-link codes from the URL
  // - Refresh auth cookies
  const { response } = updateSession(request);

  // IMPORTANT: no auth redirects here anymore.
  // If the user is not logged in, the (protected) layout
  // will redirect them server-side.
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.svg|apple-touch-icon).*)",
  ],
};
