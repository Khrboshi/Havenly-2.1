// app/api/telemetry/upgrade-intent/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Minimal telemetry endpoint:
 * - Logs upgrade intent in Vercel logs (good enough until 10 users threshold).
 * - If you later want DB storage, you can extend it safely.
 */
export async function POST() {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("UPGRADE_INTENT", {
      userId: user?.id ?? null,
      ts: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("POST /api/telemetry/upgrade-intent failed:", err);
    // still return ok to avoid UX issues
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
