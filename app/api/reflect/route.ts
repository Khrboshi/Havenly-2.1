import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, mood } = await req.json();

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
            "You are Havenly, a very concise, warm reflection coach. You respond in 2–4 short paragraphs max, focusing on validation, gentle reframing, and 1 small suggestion. You are not a therapist, you avoid diagnostics, and you never mention being an AI.",
        },
        {
          role: "user",
          content: `My current mood (1-5) is: ${mood ?? "not given"}.\nThis is what happened today:\n\n${content}`,
        },
      ],
      max_tokens: 256,
      temperature: 0.6,
    });

    const aiResponse =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Thank you for sharing. I’m here with you, even if I have no words right now.";

    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error("Groq reflection error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection." },
      { status: 500 }
    );
  }
}
