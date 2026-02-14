import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// If your project uses Supabase, keep these imports consistent with your repo.
// Adjust the import path ONLY if your project already uses a different helper.
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // if you don't have this file, remove Database typing

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // ✅ Optional auth (do NOT fail if not logged in)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ✅ Optional body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // ignore empty/invalid JSON
    }

    const source = typeof body?.source === "string" ? body.source : "upgrade-page";

    // ✅ Best-effort insert (never block UX)
    // Update table name/columns if your repo uses a different schema.
    await supabase.from("telemetry_events").insert({
      event: "upgrade_intent",
      source,
      user_id: user?.id ?? null,
      created_at: new Date().toISOString(),
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Never break the page because telemetry failed
    return new NextResponse(null, { status: 204 });
  }
}

// (Optional) prevent GET from being used in browser address bar
export async function GET() {
  return NextResponse.json({ ok: true, note: "Use POST" }, { status: 200 });
}
