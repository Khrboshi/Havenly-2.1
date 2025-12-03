import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Paths that require authentication
const PROTECTED_PATHS = ["/dashboard", "/journal", "/settings", "/tools", "/insights"];

function isProtected(pathname: string) {
  return PROTECTED_PATHS.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never block auth routes or callback routes
  const isAuthRoute =
    pathname.startsWith("/magic-login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth");

  // Update Supabase session and cookies first
  const { supabase, response } = await updateSession(request);

  // If this route is not protected → allow it
  if (!isProtected(pathname) || isAuthRoute) {
    return response; // always return updated cookies
  }

  // Check user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in → redirect to magic login (NO LOOP)
  if (!user) {
    const loginUrl = new URL("/magic-login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in users continue
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|public).*)",
  ],
  runtime: "nodejs",
};
