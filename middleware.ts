// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/", "/about", "/blog", "/privacy", "/premium", "/upgrade"];
const AUTH_PATHS = ["/magic-login", "/auth/callback", "/logout", "/install"];
const PROTECTED_PREFIXES = ["/dashboard", "/journal", "/tools", "/insights", "/settings"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
function isStaticFile(pathname: string) {
  return /\.[^/]+$/.test(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Hard skips
  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (isStaticFile(pathname)) return NextResponse.next();

  // If it's public, no auth work needed
  if (isPublicPath(pathname)) return NextResponse.next();

  // If it's neither protected nor auth-related, no auth work needed
  const needsAuthWork = isProtectedPath(pathname) || isAuthPath(pathname);
  if (!needsAuthWork) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env missing, do nothing
  if (!supabaseUrl || !supabaseAnon) return NextResponse.next();

  // Create a response we can mutate with cookies
  const res = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set({
            name,
            value,
            ...options,
            path: options?.path ?? "/",
            sameSite: (options?.sameSite as any) ?? "lax",
            secure: options?.secure ?? process.env.NODE_ENV === "production",
          });
        });
      },
    },
  });

  // Refresh cookies silently (only when needed)
  await supabase.auth.getSession();

  // Never redirect on auth routes
  if (isAuthPath(pathname)) return res;

  // Only protect specific prefixes
  if (!isProtectedPath(pathname)) return res;

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    const to = req.nextUrl.clone();
    to.pathname = "/magic-login";
    to.searchParams.set("redirected", "1");
    to.searchParams.set("next", pathname);
    return NextResponse.redirect(to);
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
