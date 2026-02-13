import { createServerSupabase } from "@/lib/supabase/server";

type Body = {
  source?: string;
  path?: string;
};

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const source = (body.source || "unknown").slice(0, 200);
  const path = (body.path || "").slice(0, 500);

  const { error: insertError } = await supabase.from("upgrade_intents").insert({
    user_id: userData.user.id,
    source,
    // created_at should be defaulted by DB column; do not send it.
  });

  if (insertError) {
    return new Response(
      JSON.stringify({
        error: "insert_failed",
        details: insertError.message,
        source,
        path,
      }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
