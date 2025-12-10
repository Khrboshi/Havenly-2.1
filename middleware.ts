// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware ONLY keeps Supabase auth cookies in sync.
 * It MUST NOT intercept /auth/callback or public pages,
 * or Supabase PKCE cookies will fail to be set.
 */
export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

/**
 * IMPORTANT:
 * We only apply middleware to PRIVATE routes.
 * This prevents interference with Supabase PKCE OAuth flow.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/settings/:path*",
  ],
};
