import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  canConsumeCredit,
  consumeCredit,
} from "@/lib/creditRules";
import { generateReflectionFromEntry } from "@/lib/ai/generateReflection";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  /**
   * 🔍 CHECK CREDIT — NO MUTATION
   */
  const allowed = await canConsumeCredit({
    supabase,
    userId,
  });

  if (!allowed.ok) {
    return NextResponse.json(
      { error: "Reflection limit reached" },
      { status: 402 }
    );
  }

  /**
   * 🧠 AI GENERATION
   */
  let reflection;
  try {
    reflection = await generateReflectionFromEntry({
      content: body.content,
      title: body.title,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }

  /**
   * ✅ CONSUME CREDIT ONLY AFTER SUCCESS
   */
  await consumeCredit({ supabase, userId });

  return NextResponse.json({ reflection });
}
