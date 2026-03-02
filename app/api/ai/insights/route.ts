// app/api/ai/insights/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

async function getUserPlanType(
  supabase: ReturnType<typeof createServerSupabase>,
  userId: string
): Promise<PlanType> {
  // ✅ FIX: read from user_credits (the single source of truth for plan status)
  // Previously this read from profiles, which was never updated on upgrade
  await ensureCreditsFresh({ supabase, userId });

  const { data } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  return normalizePlan((data as any)?.plan_type);
}

export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planType = await getUserPlanType(supabase, user.id);
  if (planType !== "PREMIUM" && planType !== "TRIAL") {
    return NextResponse.json({ error: "Premium required" }, { status: 402 });
  }

  // Query ai_response column (where reflections are stored as JSON)
  const { data: rows, error } = await supabase
    .from("journal_entries")
    .select("ai_response")
    .eq("user_id", user.id)
    .not("ai_response", "is", null)
    .limit(2000);

  if (error) {
    return NextResponse.json(
      { error: "Insights data not available yet." },
      { status: 500 }
    );
  }

  const themes: Record<string, number> = {};
  const emotions: Record<string, number> = {};

  for (const row of rows || []) {
    let parsed: any = null;

    try {
      // ai_response is stored as a JSON string
      parsed =
        typeof (row as any).ai_response === "string"
          ? JSON.parse((row as any).ai_response)
          : (row as any).ai_response;
    } catch {
      continue;
    }

    const t = Array.isArray(parsed?.themes) ? parsed.themes : [];
    const e = Array.isArray(parsed?.emotions) ? parsed.emotions : [];

    for (const item of t) {
      const k = String(item || "").trim();
      if (!k) continue;
      themes[k] = (themes[k] || 0) + 1;
    }

    for (const item of e) {
      const k = String(item || "").trim();
      if (!k) continue;
      emotions[k] = (emotions[k] || 0) + 1;
    }
  }

  return NextResponse.json(
    { themes, emotions },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
