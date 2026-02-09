import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { decrementCreditIfAllowed } from "@/lib/supabase/creditRules";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { data, error } = await supabase
      .from("user_credits")
      .select("plan_type, remaining_credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    const creditInfo = {
      plan: data?.plan_type || "FREE",
      remaining: data?.remaining_credits ?? 0,
    };

    return NextResponse.json(creditInfo, { status: 200 });
  } catch (err) {
    console.error("Credits fetch failed:", err);
    return NextResponse.json({ error: "Unable to fetch credits" }, { status: 500 });
  }
}
