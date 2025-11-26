import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes requiring authentication
const protectedRoutes = [
  "/dashboard",
  "/journal",
  "/entry",
  "/settings",
];

// Public routes always allowed
const publicRoutes = [
  "/",
  "/magic-login",
  "/auth/callback",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read Supabase session cookie pattern
  const accessToken = request.cookies.get(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}-auth-token`
  );

  const hasSession = Boolean(accessToken);

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect logged-out users away from protected pages
  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/magic-login", request.url));
  }

  // Redirect logged-in users away from magic-login
  if (pathname.startsWith("/magic-login") && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico).*)",
  ],
};
