import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require an authenticated session
const protectedRoutes = [
  "/dashboard",
  "/journal",
  "/entry",
  "/settings",
  "/account",
  "/profile",
];

// Routes that must be accessible even when logged in/out
const publicRoutes = [
  "/",
  "/magic-login",
  "/auth/callback",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase session sync handling
  const response = await updateSession(request);

  // Determine whether route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Determine whether route is public
  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Read session cookie
  const accessToken = request.cookies.get(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}-auth-token`
  );

  const hasSession = Boolean(accessToken);

  // If accessing a protected route without a session → redirect to magic login
  if (isProtected && !hasSession) {
    const redirectUrl = new URL("/magic-login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing magic-login while logged in → redirect to dashboard
  if (pathname.startsWith("/magic-login") && hasSession) {
    const redirectUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow everything else
  return response;
}

// Middleware applies to all routes except static assets and API
export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico).*)",
  ],
};
