// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware responsibilities (Hardened):
 * - Never run on /api
 * - Never run on Next static/runtime assets
 * - Never run on any static file request (anything with a file extension)
 * - Refresh Supabase auth cookies for page routes
 * - Enforce redirects ONLY for protected areas
 * - Do not interfere with auth callback / magic-link flow
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
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isStaticFile(pathname: string) {
  // Any URL ending with ".ext" (png, svg, webmanifest/json, txt, xml, css, js, etc.)
  return /\.[^/]+$/.test(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Hard skips
  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next")) return NextResponse.next();

  // Skip ALL static files (covers /pwa/*.png, /manifest.json, /offline.html, etc.)
  if (isStaticFile(pathname)) return NextResponse.next();

  // 2) Create response + Supabase client
  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fail safely: if env vars are missing, do not crash every page request
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

  // Refresh cookies (do not trust session.user for auth decisions)
  await supabase.auth.getSession();

  // Never redirect on public/auth routes
  if (isPublicPath(pathname) || isAuthPath(pathname)) return res;

  // Only enforce protection for protected routes
  if (!isProtectedPath(pathname)) return res;

  // ✅ Verified auth decision (contacts Supabase Auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/magic-login";
    redirectUrl.searchParams.set("redirected", "1");
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    // Apply to all routes except:
    // - /api
    // - /_next
    // - any path containing a dot-file extension (static files)
    "/((?!api|_next|.*\\..*).*)",
  ],
};
