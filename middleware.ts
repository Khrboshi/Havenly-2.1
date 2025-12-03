// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = [
  "/dashboard",
  "/journal",
  "/settings",
  "/tools",
  "/insights",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ❗ Directly allow magic login and auth callback
  if (
    pathname.startsWith("/magic-login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Sync Supabase session + cookies
  const { supabase, response } = await updateSession(request);

  // Apply protection only on protected pages
  if (isProtectedPath(pathname)) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/magic-login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return response;
}

export const config = {
  // ❗ Correct matcher — avoids triggering middleware globally
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/settings/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/api/auth/:path*",
    "/auth/callback",
    "/magic-login",
  ],
  runtime: "nodejs",
};
