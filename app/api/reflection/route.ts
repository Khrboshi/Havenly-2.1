import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const FREE_REFLECTION_LIMIT = 0;

export async function POST() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: plan } = await supabase
    .from("user_plans")
    .select("plan_type, reflections_used")
    .eq("user_id", user.id)
    .single();

  const planType = plan?.plan_type ?? "FREE";
  const used = plan?.reflections_used ?? 0;

  if (planType === "FREE" && used >= FREE_REFLECTION_LIMIT) {
    return NextResponse.json(
      { error: "Reflection limit reached" },
      { status: 402 }
    );
  }

  // Increment usage
  await supabase
    .from("user_plans")
    .update({ reflections_used: used + 1 })
    .eq("user_id", user.id);

  return NextResponse.json({ allowed: true });
}
