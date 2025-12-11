import { NextResponse, type NextRequest } from "next/server";
import { authMiddleware } from "@/lib/supabase/middleware";

/**
 * Enforces authentication AND keeps cookies fresh.
 */
export async function middleware(request: NextRequest) {
  const { response, session } = await authMiddleware(request);

  // If user is NOT logged in → redirect before hitting ProtectedLayout
  if (!session) {
    const redirectUrl = new URL("/magic-login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/settings/:path*",
  ],
};
