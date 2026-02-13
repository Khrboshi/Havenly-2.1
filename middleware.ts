// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * FINAL AUTH-SAFE MIDDLEWARE
 *
 * Responsibilities:
 * - Never run on /api
 * - Never run on Next static/runtime assets
 * - Never run on static files
 * - Refresh Supabase cookies silently
 * - Enforce auth ONLY on protected routes
 * - Never interfere with auth callback or magic login
 */

const PUBLIC_PATHS = ["/", "/about", "/blog", "/privacy", "/premium", "/upgrade"];
const AUTH_PATHS = ["/magic-login", "/auth/callback", "/logout"];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/journal",
  "/tools",
  "/insights",
  "/settings",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isStaticFile(pathname: string) {
  return /\.[^/]+$/.test(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // HARD SKIPS
  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (isStaticFile(pathname)) return NextResponse.next();

  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fail safe if env missing
  if (!supabaseUrl || !supabaseAnon) return res;

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // IMPORTANT:
  // Refresh auth cookies but NEVER rely on session.user
  await supabase.auth.getSession();

  // Never redirect on public or auth routes
  if (isPublicPath(pathname) || isAuthPath(pathname)) return res;

  // Only protect specific prefixes
  if (!isProtectedPath(pathname)) return res;

  // VERIFIED auth decision
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/magic-login";

    // Prevent redirect loops
    if (!redirectUrl.searchParams.has("redirected")) {
      redirectUrl.searchParams.set("redirected", "1");
    }

    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
};
