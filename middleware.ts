// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
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
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/journal",
    "/tools",
    "/insights",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const redirectUrl = new URL("/magic-login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && pathname === "/magic-login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/magic-login",
  ],
};
