import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require a logged-in user
const PROTECTED_PATHS = [
  "/dashboard",
  "/journal",
  "/settings",
  "/tools",
  "/insights",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

export async function middleware(request: NextRequest) {
  //
  // 1) Sync Supabase session + cookies
  //
  const { supabase, response } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Auth-related routes (never block)
  const isAuthRoute =
    pathname.startsWith("/magic-login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth");

  //
  // 2) Protect logged-in pages
  //
  if (isProtectedPath(pathname) && !isAuthRoute) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const loginUrl = new URL("/magic-login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    //
    // 3) Add plan/credit info (non-blocking)
    //
    try {
      const { data: planRow } = await supabase
        .from("user_plans")
        .select("plan_type, credits_balance")
        .eq("user_id", user.id)
        .maybeSingle();

      const planType = planRow?.plan_type ?? "FREE";
      const credits = planRow?.credits_balance ?? 0;

      response.headers.set("x-user-plan", planType);
      response.headers.set("x-user-credits", String(credits));
    } catch (err) {
      console.error("Plan middleware error:", err);
    }

    return response;
  }

  //
  // 4) Default — just return the synced session response
  //
  return response;
}

//
// 🔥 CRITICAL: force middleware to use Node.js runtime
// otherwise Supabase sessions break on protected pages
//
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
  runtime: "nodejs",
};
