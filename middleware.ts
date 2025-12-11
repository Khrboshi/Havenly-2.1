// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * This middleware keeps Supabase auth cookies refreshed.
 * It MUST run on all protected top-level routes.
 */
export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

/**
 * IMPORTANT:
 * We include both the route and route/* patterns.
 * This ensures refresh works on hard reloads, not only on subpages.
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
