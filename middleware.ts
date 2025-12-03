import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED = [
  "/dashboard",
  "/journal",
  "/settings",
  "/tools",
  "/insights",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/magic-login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth");

  // Public routes → no auth needed
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Only sync session for protected pages
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    const { supabase, response } = await updateSession(request);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/magic-login", request.url));
    }

    return response;
  }

  // Default
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
