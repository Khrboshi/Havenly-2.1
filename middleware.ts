// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request);

  // This is REQUIRED for refresh tokens to refresh properly.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/magic-login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/tools/:path*",
    "/insights/:path*",
    "/settings/:path*",
  ],
};
