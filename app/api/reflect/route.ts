export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createServerSupabase } from "@/lib/supabase/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, mood, entryId, userId } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key missing on server." },
        { status: 500 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid content." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are Havenly — a warm, emotionally intelligent reflection companion.

Your job:
• Validate the user's feelings authentically  
• Reflect back what is *unique* about what they wrote  
• Gently explore what might be beneath the surface  
• Offer 1 soft, actionable suggestion  
• Stay supportive, human, grounded  
• Never mention AI, therapy, diagnosis, or mental health treatment  
• Write 3–5 short paragraphs (not too similar across entries)
          `,
        },
        {
          role: "user",
          content: `
User mood: ${mood ?? "not provided"} / 5.

User reflection:
"${content}"

Write a personalized response that acknowledges the user's unique words.
          `,
        },
      ],
      max_tokens: 320,
      temperature: 0.85,
      top_p: 0.9,
      presence_penalty: 0.8,
      frequency_penalty: 0.3,
    });

    const aiResponse =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Thank you for opening up today — I’m here with you.";

    // If entryId present → store reflection in DB
    if (entryId && userId) {
      const supabase = await createServerSupabase();
      await supabase
        .from("journal_entries")
        .update({ reflection: aiResponse })
        .eq("id", entryId)
        .eq("user_id", userId);
    }

    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error("Groq reflection error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection." },
      { status: 500 }
    );
  }
}
