import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

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

  if (isProtected && !session?.user) {
    const redirectUrl = new URL("/magic-login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
  ],
};
