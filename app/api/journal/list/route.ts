export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json([], { status: 200 });

  const { data } = await supabase
    .from("journal")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
