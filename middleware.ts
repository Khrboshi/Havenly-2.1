import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that must be authenticated.
// These are the same paths you already used.
const PROTECTED_PATHS = ["/dashboard", "/journal", "/settings", "/tools", "/insights"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

export async function middleware(request: NextRequest) {
  // 1) Keep existing behaviour: sync Supabase auth session and cookies
  const { supabase, response } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Public / auth routes that should never cause redirect loops
  const isAuthRoute =
    pathname.startsWith("/magic-login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth");

  // 2) Authentication guard for protected paths
  if (isProtectedPath(pathname) && !isAuthRoute) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      // Not logged in → redirect to magic-login, preserve where they came from
      const loginUrl = new URL("/magic-login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3) Light plan awareness (NON-BREAKING)
    //    We only set headers; we do NOT block access here.
    try {
      const { data: planRow, error: planError } = await supabase
        .from("user_plans")
        .select("plan_type, credits_balance")
        .eq("user_id", user.id)
        .maybeSingle();

      let planType = "FREE";
      let credits = 0;

      if (!planError && planRow) {
        planType = planRow.plan_type || "FREE";
        credits = planRow.credits_balance ?? 0;
      }

      response.headers.set("x-user-plan", planType);
      response.headers.set("x-user-credits", String(credits));
    } catch (err) {
      console.error("Error loading user plan in middleware:", err);
      // Fail silently here – we never block access because of this.
    }

    return response;
  }

  // 4) For all other routes, just keep the original response
  // (session sync only – no auth enforcement, no blocking)
  return response;
}

export const config = {
  matcher: [
    // Apply middleware to everything EXCEPT static files/public assets
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
