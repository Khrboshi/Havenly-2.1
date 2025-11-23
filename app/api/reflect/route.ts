export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, mood } = await req.json();

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
          content:
            "You are Havenly, a concise, warm reflection assistant. You respond in 2–4 short paragraphs, focusing on validation, gentle reframing, and one small suggestion. Avoid diagnostic or clinical language. Never mention that you are an AI.",
        },
        {
          role: "user",
          content: `Mood: ${mood ?? "not provided"} / 5.\n\nUser reflection:\n${content}`,
        },
      ],
      max_tokens: 256,
      temperature: 0.6,
    });

    const aiResponse =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Thank you for sharing. I'm here with you.";

    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error("Groq reflection error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection." },
      { status: 500 }
    );
  }
}
