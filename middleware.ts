// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Temporary no-op middleware.
 *
 * Why:
 * - Your Supabase PKCE callback at /auth/callback is correctly creating
 *   the session cookies.
 * - Your (protected) layout is correctly protecting /dashboard, /journal,
 *   /tools, /insights, /settings.
 *
 * This middleware used to call Supabase and could interfere with the
 * auth cookies on a hard reload (Ctrl+F5). For now, we simply let the
 * request pass through untouched.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// No config matcher => default behavior, but since we are NOT changing
// cookies or running Supabase here, this is safe and lightweight.
