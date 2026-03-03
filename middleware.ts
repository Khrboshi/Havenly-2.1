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

  if (!supabaseUrl || !supabaseAnon) return NextResponse.next();

  // Never redirect on auth routes — pass through immediately
  if (isAuthPath(pathname)) return NextResponse.next();

  // Non-protected routes — pass through immediately, no Supabase call
  if (!isProtectedPath(pathname)) return NextResponse.next();

  // Only create Supabase client and check auth for protected routes
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

  // Single auth check — no redundant getSession() call
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
