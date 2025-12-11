// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware that keeps Supabase auth cookies fresh.
 * Must run on all protected AND entry routes to avoid logout on hard reload.
 */
export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

/**
 * IMPORTANT:
 * We now include the root "/" so that hard reloads
 * (especially after login or direct navigation)
 * correctly refresh the session cookies.
 *
 * We also include both `/route` and `/route/*` for all protected areas.
 */
export const config = {
  matcher: [
    "/",                 // REQUIRED to prevent logout on hard refresh
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
