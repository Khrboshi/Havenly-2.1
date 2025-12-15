import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST { entryId: string, content: string, title?: string }
 * Enforces credits server-side via RPC: consume_reflection_credit()
 * Then calls GROQ (OpenAI-compatible) to generate a supportive reflection.
 */
export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const entryId = String(body?.entryId || "").trim();
  const content = String(body?.content || "").trim();
  const title = String(body?.title || "").trim();

  if (!entryId || !content) {
    return NextResponse.json(
      { error: "entryId and content are required" },
      { status: 400 }
    );
  }

  // Consume a credit (or allow premium without decrement)
  const { data: planData, error: consumeErr } = await supabase.rpc(
    "consume_reflection_credit"
  );

  if (consumeErr) {
    const msg = consumeErr.message || "";
    if (msg.includes("NO_CREDITS")) {
      return NextResponse.json(
        { error: "NO_CREDITS", code: "NO_CREDITS" },
        { status: 402 }
      );
    }
    return NextResponse.json(
      { error: "Failed to consume credit" },
      { status: 500 }
    );
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY on server" },
      { status: 500 }
    );
  }

  const system = `
You are Havenly, a calm and supportive reflection coach.
Be warm, non-judgmental, culturally respectful, and concise.
No diagnosis, no medical claims, no therapy instructions.
Output JSON only with keys:
- summary (string)
- themes (array of strings)
- emotions (array of strings)
- gentle_next_step (string)
- questions (array of 2 strings)
`;

  const userPrompt = `
Title: ${title || "Untitled"}
Entry:
${content}

Return JSON only.
`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.6,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    return NextResponse.json(
      { error: "AI request failed", details: t.slice(0, 500) },
      { status: 500 }
    );
  }

  const json = await resp.json();
  const raw = json?.choices?.[0]?.message?.content || "";

  let parsed: any = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // If model returns non-JSON, fail gracefully
    return NextResponse.json(
      { error: "AI output was not valid JSON", raw: String(raw).slice(0, 500) },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reflection: parsed,
    plan: Array.isArray(planData) ? planData[0] : planData,
  });
}
