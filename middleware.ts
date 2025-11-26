import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedRoutes = ["/dashboard", "/journal", "/settings", "/premium"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const { supabaseToken } = response;

  const isLoggedIn = !!supabaseToken;
  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path === route || path.startsWith(route + "/")
  );

  const isMagicLogin = path.startsWith("/magic-login");

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/magic-login", request.url));
  }

  if (isLoggedIn && isMagicLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response.nextResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
