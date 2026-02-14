import { NextResponse } from "next/server";

export const runtime = "nodejs"; // safe default

export async function POST(req: Request) {
  try {
    // Best-effort parse (never fail)
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const source = typeof body?.source === "string" ? body.source : "upgrade-page";

    // Online-verifiable telemetry for now (Vercel Runtime Logs)
    console.log("[telemetry] upgrade_intent", {
      source,
      ts: new Date().toISOString(),
      ua: req.headers.get("user-agent") || null,
      referer: req.headers.get("referer") || null,
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Never break the app because telemetry failed
    return new NextResponse(null, { status: 204 });
  }
}

// Make GET explicit (so typing the URL in the browser doesn't look "broken")
export async function GET() {
  return NextResponse.json({ ok: true, note: "Use POST" }, { status: 200 });
}
