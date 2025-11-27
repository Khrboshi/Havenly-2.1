import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Protected routes that require login
const PROTECTED_PATHS = ["/dashboard", "/journal", "/settings", "/tools"];

export async function middleware(request: NextRequest) {
  // Sync Supabase auth session and cookies
  const { supabase, response } = await updateSession(request);

  // Retrieve user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;
  const path = request.nextUrl.pathname;

  // 1. AUTH PROTECTION — redirect unauthenticated users
  if (!isLoggedIn && PROTECTED_PATHS.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/magic-login";
    return NextResponse.redirect(url);
  }

  // 2. USER PLAN (Placeholder until Stripe is integrated)
  //    This ensures the app behaves consistently for now.
  response.headers.set("x-user-plan", "free"); // always free for now

  return response;
}

export const config = {
  matcher: [
    // Apply middleware to everything EXCEPT static files:
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
