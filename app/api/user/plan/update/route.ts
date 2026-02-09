// app/api/user/plan/update/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { setUserPlan, PlanType } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json().catch(() => ({}));
    const target = String(body?.plan ?? "").toUpperCase();

    const targetPlan: PlanType =
      target === "PREMIUM" || target === "TRIAL" || target === "FREE"
        ? (target as PlanType)
        : "FREE";

    if (!["FREE", "TRIAL", "PREMIUM"].includes(targetPlan)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    await setUserPlan({ supabase, userId, planType: targetPlan });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/user/plan/update failed:", err);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
