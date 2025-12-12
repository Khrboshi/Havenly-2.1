import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/magic-login") ||
    req.nextUrl.pathname.startsWith("/auth");

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/journal") ||
    req.nextUrl.pathname.startsWith("/tools") ||
    req.nextUrl.pathname.startsWith("/insights") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/magic-login";
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
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
  ],
};
