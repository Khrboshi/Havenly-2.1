export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const supabase = createServerSupabase();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json(null);

  const { data } = await supabase
    .from("journal")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", params.id)
    .maybeSingle();

  return NextResponse.json(data);
}
