import { NextResponse } from "next/server";

/**
 * Placeholder premium status API.
 * For now, always returns premium: false.
 * Later, you can wire this to Supabase user_metadata or a profiles table.
 */
export async function GET() {
  return NextResponse.json({
    premium: false,
    premiumUntil: null,
    source: "placeholder",
  });
}
