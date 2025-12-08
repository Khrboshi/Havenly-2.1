import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ----- PUBLIC ROUTES -----
  const PUBLIC = [
    "/",
    "/magic-login",
    "/auth/callback",
    "/api/auth",
  ];

  const isPublic = PUBLIC.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  // Always sync session cookies
  const { supabase, response } = await updateSession(request);

  if (isPublic) {
    return response; // return the SAME response to preserve cookies
  }

  // ----- PROTECTED ROUTES -----
  const PROTECTED = [
    "/dashboard",
    "/journal",
    "/settings",
    "/tools",
    "/insights",
  ];

  const isProtected = PROTECTED.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = new URL("/magic-login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname);

      // IMPORTANT: copy cookies into redirect response
      const redirectResponse = NextResponse.redirect(redirectUrl);
      request.cookies.getAll().forEach((c) =>
        redirectResponse.cookies.set(c.name, c.value)
      );

      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon).*)",
  ],
};
