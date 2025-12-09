// app/api/user/plan/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan, ensurePlanRow } from "@/lib/userPlan";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    // Ensure row exists
    await ensurePlanRow(user.id);

    // Fetch full computed plan
    const plan = await getUserPlan(user.id);

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("GET user plan error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
