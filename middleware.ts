// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const AUTH_PATHS = ["/magic-login", "/auth/callback", "/logout", "/install"];
const PROTECTED_PREFIXES = ["/dashboard", "/journal", "/tools", "/insights", "/settings"];

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

  // Refresh cookies silently (only runs on matched routes)
  await supabase.auth.getSession();

  // Never redirect on auth routes
  if (isAuthPath(pathname)) return res;

  // Protect only protected prefixes
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

/**
 * CRITICAL: This is the actual cost-saving change.
 * Middleware runs ONLY on protected + auth routes now.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/settings/:path*",
    "/magic-login",
    "/auth/:path*",
    "/logout",
    "/install",
  ],
};
