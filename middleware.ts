import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/journal",
    "/settings",
    "/account",
    "/profile",
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      pathname === route || pathname.startsWith(`${route}/`)
    );

  // If trying to access protected content while logged out
  if (isProtected && !session?.user) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
  ],
};
