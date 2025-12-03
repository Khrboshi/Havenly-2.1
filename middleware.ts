import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that NEVER require auth
  const PUBLIC_ROUTES = [
    "/",
    "/magic-login",
    "/auth/callback",
    "/api/auth",
  ];

  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Sync session but DO NOT redirect yet
  const { supabase, response } = await updateSession(request);

  // Protected routes (must be logged in)
  const PROTECTED_ROUTES = [
    "/dashboard",
    "/journal",
    "/settings",
    "/tools",
    "/insights",
  ];

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If protected route → check user
  if (isProtected && !isPublic) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = new URL("/magic-login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Otherwise, continue
  return response;
}

/**
 * CRITICAL: Middleware matcher MUST NOT include static assets
 * AND MUST NOT catch magic-login unnecessarily.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.svg|apple-touch-icon).*)",
  ],
};
