import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedRoutes = ["/dashboard", "/journal"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isLoggedIn = request.cookies.get("sb-access-token");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/magic-login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
