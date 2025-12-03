export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "not logged in" }, { status: 401 });

  const { data, error } = await supabase
    .from("journal")
    .insert({
      user_id: user.id,
      content: body.content,
      title: body.title,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
