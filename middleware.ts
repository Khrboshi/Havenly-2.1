// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware responsibilities (Hardened):
 * - Refresh Supabase auth cookies on ALL non-static PAGE routes (public + protected)
 * - Enforce redirects ONLY for protected areas
 * - Never interfere with auth callback / magic-link flow
 * - Avoid redirect loops and avoid running on /api
 *
 * ✅ PWA hardening added:
 * - Do NOT run middleware on manifest/service-worker/pwa assets (prevents HTML being served for icons/manifest)
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API routes explicitly (avoid unexpected behavior + overhead)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ✅ Skip PWA / install + icon assets completely (must not return HTML/redirects)
  if (
    pathname === "/manifest.json" ||
    pathname === "/service-worker.js" ||
    pathname.startsWith("/pwa/") ||
    pathname === "/favicon-16.png" ||
    pathname === "/favicon-32.png" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // Create Supabase server client with cookie passthrough (critical for refresh)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  /**
   * Always call getSession() once to:
   * - refresh cookies if needed
   * - keep server-rendered UI (Navbar, layouts) consistent without manual refresh
   *
   * This is safe as long as we do NOT redirect for public/auth routes.
   */
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Never redirect on explicit public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return res;
  }

  // Never redirect on auth-related paths (magic link + callback must be uninterrupted)
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return res;
  }

  // Enforce protection only for known protected areas
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return res;
  }

  // Redirect unauthenticated users away from protected pages
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/magic-login";
    redirectUrl.searchParams.set("redirected", "1");
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Run middleware on all app routes except static assets + PWA assets.
     * /api is handled inside middleware (explicit early return).
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|favicon-16.png|favicon-32.png|apple-touch-icon.png|manifest.json|service-worker.js|pwa/|robots.txt|sitemap.xml).*)",
  ],
};
