// app/api/ai/weekly-summary/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

// ── Cache duration: regenerate once per week ──────────────────────────────────
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// ── Fallback filter (mirrors insights API) ────────────────────────────────────
const FALLBACK_THEMES = new Set([
  "self-awareness", "processing", "presence",
  "consistency", "recovery", "self-respect", "motivation",
  "recognition", "boundaries", "self-worth", "connection", "visibility",
]);
const FALLBACK_EMOTIONS = new Set([
  "uncertainty", "restlessness", "quiet courage",
  "pride", "tiredness", "determination",
  "frustration", "hurt", "longing", "confusion",
]);
const FALLBACK_CP_PREFIX = "you're in the middle of something";

const isFallbackT = (k: string) => FALLBACK_THEMES.has(k.toLowerCase().trim());
const isFallbackE = (k: string) => FALLBACK_EMOTIONS.has(k.toLowerCase().trim());
const isFallbackCP = (k: string) => k.toLowerCase().trim().startsWith(FALLBACK_CP_PREFIX);

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

function display(k: string) {
  const t = k.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function parseAI(raw: any) {
  try { return typeof raw === "string" ? JSON.parse(raw) : raw; }
  catch { return null; }
}

// ── Groq caller (same pattern as generateReflection) ─────────────────────────
async function callGroq(system: string, user: string): Promise<string> {
  const apiKey = process.env.GROQAPIKEY || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQAPIKEY");
  const model = process.env.GROQMODEL || "llama-3.3-70b-versatile";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 400,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Groq ${res.status}: ${text}`);
    }

    const data: any = await res.json();
    return String(data?.choices?.[0]?.message?.content ?? "").trim();
  } finally {
    clearTimeout(timer);
  }
}

// ── Build the Groq prompt from real insight data ──────────────────────────────
function buildSummaryPrompt(opts: {
  entryCount: number;
  topThemes: string[];
  topEmotions: string[];
  topCorepatterns: string[];
  momentum: string;
  trendUp: string[];
  trendDown: string[];
  firstEntryDate: string | null;
}): { system: string; user: string } {
  const {
    entryCount, topThemes, topEmotions, topCorepatterns,
    momentum, trendUp, trendDown, firstEntryDate,
  } = opts;

  const since = firstEntryDate
    ? new Date(firstEntryDate).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "recently";

  const system = `You are Havenly, a calm and perceptive AI journaling companion.
Your job is to write a short, warm, personal summary of what you've noticed across a user's journal entries.

Rules:
- Write 2–3 short paragraphs. No more.
- Speak directly to the user ("you", "your") but gently — not clinically.
- Be specific about their actual patterns — don't be vague or generic.
- Do NOT use therapy-speak, jargon, or prescriptive advice.
- Do NOT list bullet points or use headers.
- Sound like a thoughtful friend who has been paying attention, not a chatbot.
- Acknowledge that patterns can be hard to see from inside them.
- End with one quiet, open question — not demanding, just curious.
- Keep it under 180 words total.`;

  const parts: string[] = [
    `This user has written ${entryCount} journal entries since ${since}.`,
  ];

  if (topEmotions.length) {
    parts.push(`The emotions that come up most often: ${topEmotions.slice(0, 4).join(", ")}.`);
  }
  if (topThemes.length) {
    parts.push(`Recurring themes across their entries: ${topThemes.slice(0, 4).join(", ")}.`);
  }
  if (topCorepatterns.length) {
    parts.push(`The most common underlying dynamic Havenly detected: "${topCorepatterns[0]}".`);
    if (topCorepatterns[1]) {
      parts.push(`Also recurring: "${topCorepatterns[1]}".`);
    }
  }
  if (trendUp.length) {
    parts.push(`Recently rising: ${trendUp.slice(0, 3).join(", ")}.`);
  }
  if (trendDown.length) {
    parts.push(`Recently fading: ${trendDown.slice(0, 3).join(", ")}.`);
  }
  if (momentum && momentum !== "Steady") {
    parts.push(`Overall momentum: ${momentum}.`);
  }

  const user = parts.join("\n") +
    "\n\nWrite the summary now. No preamble, no sign-off. Just the paragraphs.";

  return { system, user };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET() {
  const supabase = createServerSupabase();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Plan check
  await ensureCreditsFresh({ supabase, userId });
  const { data: credits } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  const plan = normalizePlan((credits as any)?.plan_type);
  if (plan !== "PREMIUM" && plan !== "TRIAL") {
    return NextResponse.json({ error: "Premium required" }, { status: 402 });
  }

  // ── Check cache in profiles ───────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("weekly_summary, weekly_summary_generated_at")
    .eq("id", userId)
    .maybeSingle();

  const cachedSummary = (profile as any)?.weekly_summary as string | null;
  const cachedAt = (profile as any)?.weekly_summary_generated_at as string | null;

  const isFresh =
    cachedSummary &&
    cachedAt &&
    Date.now() - new Date(cachedAt).getTime() < CACHE_TTL_MS;

  if (isFresh) {
    return NextResponse.json(
      { summary: cachedSummary, generatedAt: cachedAt, cached: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // ── Build insight data from entries ──────────────────────────────────────
  const { data: rows } = await supabase
    .from("journal_entries")
    .select("ai_response, created_at")
    .eq("user_id", userId)
    .not("ai_response", "is", null)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (!rows?.length) {
    return NextResponse.json({ error: "Not enough data yet." }, { status: 422 });
  }

  const themes: Record<string, number> = {};
  const emotions: Record<string, number> = {};
  const corepatterns: Record<string, number> = {};

  const now = Date.now();
  const FOUR_WEEKS = 28 * 24 * 60 * 60 * 1000;
  const recentEm: Record<string, number> = {};
  const olderEm: Record<string, number> = {};
  let firstEntryDate: string | null = null;
  let entryCount = 0;

  for (const row of rows) {
    const parsed = parseAI((row as any).ai_response);
    if (!parsed) continue;

    entryCount++;
    const created = (row as any).created_at;
    if (!firstEntryDate || new Date(created) < new Date(firstEntryDate)) {
      firstEntryDate = created;
    }

    const age = now - new Date(created).getTime();
    const isRecent = age <= FOUR_WEEKS;
    const isOlder = age > FOUR_WEEKS && age <= FOUR_WEEKS * 2;

    for (const t of Array.isArray(parsed.themes) ? parsed.themes : []) {
      const k = String(t || "").trim();
      if (!k || isFallbackT(k)) continue;
      const d = display(k);
      themes[d] = (themes[d] || 0) + 1;
    }

    for (const e of Array.isArray(parsed.emotions) ? parsed.emotions : []) {
      const k = String(e || "").trim();
      if (!k || isFallbackE(k)) continue;
      const d = display(k);
      emotions[d] = (emotions[d] || 0) + 1;
      if (isRecent) recentEm[d] = (recentEm[d] || 0) + 1;
      if (isOlder) olderEm[d] = (olderEm[d] || 0) + 1;
    }

    const cp = typeof parsed.corepattern === "string" ? parsed.corepattern.trim() : "";
    if (cp.length >= 20 && cp.length <= 200 && !isFallbackCP(cp)) {
      const d = display(cp);
      corepatterns[d] = (corepatterns[d] || 0) + 1;
    }
  }

  const topThemes = Object.entries(themes).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
  const topEmotions = Object.entries(emotions).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
  const topCorepatterns = Object.entries(corepatterns).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);

  const trendUp: string[] = [];
  const trendDown: string[] = [];
  for (const [e, rc] of Object.entries(recentEm)) {
    if (rc > (olderEm[e] ?? 0) + 1) trendUp.push(e);
  }
  for (const [e, oc] of Object.entries(olderEm)) {
    if (oc > (recentEm[e] ?? 0) + 1) trendDown.push(e);
  }

  // Momentum
  const POSITIVE = new Set(["calm", "hope", "hopeful", "joy", "grateful", "relief",
    "excited", "contentment", "clarity", "motivated", "open", "curious", "optimistic"]);
  const HEAVY = new Set(["dread", "despair", "hopeless", "numb", "exhausted",
    "overwhelmed", "trapped", "grief", "shame", "guilt", "defeated"]);
  let pos = 0, hvy = 0;
  for (const [e, c] of Object.entries(recentEm)) {
    if (POSITIVE.has(e.toLowerCase())) pos += c;
    if (HEAVY.has(e.toLowerCase())) hvy += c;
  }
  let momentum = "Steady";
  if (pos > hvy + 2) momentum = "Lifting";
  else if (hvy > pos + 2) momentum = "Heavy";
  else if (trendUp.length > trendDown.length) momentum = "Shifting";
  else if (trendDown.length > trendUp.length) momentum = "Softening";

  if (!topThemes.length && !topEmotions.length) {
    return NextResponse.json(
      { error: "Not enough personal data yet. Keep writing and generating reflections." },
      { status: 422 }
    );
  }

  // ── Generate summary ──────────────────────────────────────────────────────
  const { system, user } = buildSummaryPrompt({
    entryCount,
    topThemes,
    topEmotions,
    topCorepatterns,
    momentum,
    trendUp,
    trendDown,
    firstEntryDate,
  });

  let summary: string;
  try {
    summary = await callGroq(system, user);
  } catch (err) {
    console.error("[weekly-summary] Groq failed:", err);
    return NextResponse.json(
      { error: "Summary generation failed. Try again in a moment." },
      { status: 500 }
    );
  }

  if (!summary || summary.length < 50) {
    return NextResponse.json(
      { error: "Summary generation failed. Try again in a moment." },
      { status: 500 }
    );
  }

  // ── Cache in profiles (upsert) ────────────────────────────────────────────
  // Uses service role key so it can write to profiles without RLS issues
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const generatedAt = new Date().toISOString();
  await adminClient
    .from("profiles")
    .upsert(
      { id: userId, weekly_summary: summary, weekly_summary_generated_at: generatedAt },
      { onConflict: "id" }
    );

  return NextResponse.json(
    { summary, generatedAt, cached: false },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// ── Force regenerate (POST) ───────────────────────────────────────────────────
// Called when user clicks "Regenerate"
export async function POST() {
  const supabase = createServerSupabase();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Clear cache then delegate to GET logic by clearing the stored summary
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await adminClient
    .from("profiles")
    .upsert(
      {
        id: session.user.id,
        weekly_summary: null,
        weekly_summary_generated_at: null,
      },
      { onConflict: "id" }
    );

  // Return 204 — client calls GET next
  return new Response(null, { status: 204 });
}
