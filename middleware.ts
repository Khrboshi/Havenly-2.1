import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  return await updateSession(req, res);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/journal",
    "/journal/:path*",
    "/tools",
    "/tools/:path*",
    "/insights",
    "/insights/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
