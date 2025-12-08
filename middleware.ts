import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // PUBLIC ROUTES
  const PUBLIC_ROUTES = [
    "/",
    "/magic-login",
    "/auth/callback",
    "/api/auth",
  ];

  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Always sync session
  const { supabase, response } = await updateSession(request);

  // If route is public → return immediately (DON’T CHECK USER)
  if (isPublic) {
    return response;
  }

  // PROTECTED ROUTES
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

  if (isProtected) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = new URL("/magic-login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.svg|apple-touch-icon).*)",
  ],
};
