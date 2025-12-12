// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Routes that NEVER require authentication
 * Middleware must IGNORE these completely
 */
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/blog/",
  "/privacy",
  "/premium",
  "/upgrade",
  "/magic-login",
  "/auth",
  "/auth/callback",
  "/_next",
  "/favicon.ico",
  "/icon.svg",
];

/**
 * Routes that REQUIRE authentication
 */
const PROTECTED_PATHS = [
  "/dashboard",
  "/journal",
  "/tools",
  "/insights",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Skip public routes completely
  if (
    PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return NextResponse.next();
  }

  // ✅ Skip non-protected routes
  if (!PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 🔐 Auth check ONLY for protected routes
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/magic-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
