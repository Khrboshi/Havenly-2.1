// app/api/reflect/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    // Read request body
    const body = await req.json();
    const { journalEntry } = body;

    if (!journalEntry || typeof journalEntry !== "string") {
      return NextResponse.json(
        { success: false, error: "MISSING_INPUT" },
        { status: 400 }
      );
    }

    // Groq Client
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are a supportive, calm, introspective AI coach.
Provide a structured reflection on the user's journal entry.

Journal Entry:
"${journalEntry}"

Return three parts:
1. A grounding reflection
2. A deeper insight
3. A suggested next step
    `;

    const completion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.6,
    });

    const aiText = completion.choices[0].message?.content || "";

    return NextResponse.json({
      success: true,
      reflection: aiText,
    });
  } catch (err) {
    console.error("Reflect API error:", err);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
