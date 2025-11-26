export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

// Initialize Groq server-side
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { entryId, content, mood } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key missing on server." },
        { status: 500 }
      );
    }

    if (!entryId || typeof entryId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid entryId." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid content." },
        { status: 400 }
      );
    }

    // Generate reflection using Groq AI
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are Havenly — a warm, emotionally intelligent reflection companion.

Your role:
• Validate the user's feelings authentically
• Reflect back what's unique about their writing
• Explore gently, without pressure
• Offer one soft suggestion
• Never sound repetitive
• Never mention AI, therapy, mental health terminology, or diagnoses
• Use 3–5 short paragraphs, varied tone and rhythm

Mood guidance:
• Use it subtly — not directly stated
          `
        },
        {
          role: "user",
          content: `
User mood: ${mood ?? "not provided"} / 5

User reflection:
"${content}"

Write a deeply personalized response that acknowledges the user's unique emotional tone.
          `
        }
      ],
      max_tokens: 380,
      temperature: 0.85,
      top_p: 0.9,
      presence_penalty: 0.8,
      frequency_penalty: 0.35,
    });

    const reflection =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Thank you for opening up today — I’m here with you.";

    // Store reflection back into Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // secure, server-only
      { auth: { persistSession: false } }
    );

    const { error: updateError } = await supabase
      .from("journal_entries")
      .update({ reflection })
      .eq("id", entryId);

    if (updateError) {
      console.error("DB update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save reflection." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reflection });
  } catch (error) {
    console.error("Groq reflection error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection." },
      { status: 500 }
    );
  }
}
