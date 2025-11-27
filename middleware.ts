import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Protected routes (only for authenticated users)
const PROTECTED_PATHS = ["/dashboard", "/journal", "/settings", "/tools"];

export async function middleware(request: NextRequest) {
  // Update Supabase session and cookies
  const { supabase, response } = await updateSession(request);

  // Retrieve the active session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;
  const path = request.nextUrl.pathname;

  // Block unauthenticated access to protected routes
  if (!isLoggedIn && PROTECTED_PATHS.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/magic-login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Apply the middleware on ALL routes EXCEPT:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Placeholder until Stripe is added
  response.headers.set("x-user-plan", "free");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/journal/:path*", "/tools/:path*"],
};
