import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Sync Supabase session
  const { supabase, response } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Paths that never require auth:
  const PUBLIC_PATHS = [
    "/magic-login",
    "/auth/callback",
    "/api/auth",
    "/",
    "/favicon.ico",
    "/favicon.png",
    "/icon.svg",
  ];

  const isPublic = PUBLIC_PATHS.some((p) =>
    pathname === p || pathname.startsWith(`${p}/`)
  );

  // Routes that are protected
  const PROTECTED_PATHS = [
    "/dashboard",
    "/journal",
    "/settings",
    "/tools",
    "/insights",
  ];

  const isProtected = PROTECTED_PATHS.some((p) =>
    pathname === p || pathname.startsWith(`${p}/`)
  );

  // If the route is protected, check if user is logged in
  if (isProtected) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/magic-login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// IMPORTANT — only include these matchers.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.svg).*)",
  ],
};
