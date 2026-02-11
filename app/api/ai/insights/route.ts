// app/api/ai/insights/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

async function getUserPlanType(
  supabase: ReturnType<typeof createServerSupabase>,
  userId: string
): Promise<PlanType> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type, plan, tier")
    .eq("id", userId)
    .maybeSingle();

  const raw = (profile?.plan_type || profile?.plan || profile?.tier || "")
    .toString()
    .toUpperCase();

  if (raw === "PREMIUM") return "PREMIUM";
  if (raw === "TRIAL") return "TRIAL";
  return "FREE";
}

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planType = await getUserPlanType(supabase, session.user.id);
  if (planType !== "PREMIUM") {
    return NextResponse.json({ error: "Premium required" }, { status: 402 });
  }

  // ---- Query reflections (EDIT HERE if your schema differs) ----
  // Expected: journal_entries has user_id + reflection(json)
  const { data: rows, error } = await supabase
    .from("journal_entries")
    .select("reflection")
    .eq("user_id", session.user.id)
    .not("reflection", "is", null)
    .limit(2000);

  if (error) {
    // Safe failure (won't crash UI)
    return NextResponse.json(
      { error: "Insights data not available yet." },
      { status: 500 }
    );
  }

  const themes: Record<string, number> = {};
  const emotions: Record<string, number> = {};

  for (const row of rows || []) {
    const r: any = (row as any).reflection;
    const t = Array.isArray(r?.themes) ? r.themes : [];
    const e = Array.isArray(r?.emotions) ? r.emotions : [];

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

  return NextResponse.json({ themes, emotions });
}
