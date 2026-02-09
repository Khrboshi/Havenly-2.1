import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user)
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });

  await supabase
    .from("telemetry")
    .insert({
      user_id: userData.user.id,
      event: "upgrade_intent",
      context: { path: req.url },
    });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
