// lib/ai/generateReflection.ts

import Groq from "groq-sdk";

type ReflectionResult = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * GROQ-backed reflection generator
 *
 * Guarantees:
 * - Reflections are grounded strictly in the user's text
 * - No invented events or emotions
 * - Calm, non-therapeutic tone
 * - Deterministic structure (JSON-only)
 *
 * Safe to call behind credit enforcement.
 */
export async function generateReflectionFromEntry({
  title,
  content,
}: {
  title?: string;
  content: string;
}): Promise<ReflectionResult> {
  const trimmed = content.trim();

  // Very short entries → graceful handling
  if (trimmed.length < 20) {
    return {
      summary:
        "This entry is quite brief, making a deeper reflection difficult right now.",
      themes: [],
      emotions: [],
      gentle_next_step:
        "You may want to add a few more lines about what prompted this entry.",
      questions: [
        "What made you decide to write this today?",
        "What feels unfinished or unclear here?",
      ],
    };
  }

  const systemPrompt = `
You are a calm journaling reflection assistant.

Rules you MUST follow:
- Base everything ONLY on what the user actually wrote.
- Do NOT invent events, motivations, or emotions.
- Avoid generic or clinical therapy language.
- Be proportional: short entries get light reflections.
- If something is unclear, acknowledge uncertainty.

Output rules:
- Respond with VALID JSON only.
- No markdown.
- No commentary.
- No extra text.

Required JSON format:
{
  "summary": string,
  "themes": string[],
  "emotions": string[],
  "gentle_next_step": string,
  "questions": string[]
}
`;

  const userPrompt = `
Journal title: ${title ?? "Untitled"}

Journal entry:
"""
${trimmed}
"""
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.25,
      max_tokens: 600,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty Groq response");
    }

    const parsed = JSON.parse(raw);

    return {
      summary: String(parsed.summary ?? "").trim(),
      themes: Array.isArray(parsed.themes) ? parsed.themes.map(String) : [],
      emotions: Array.isArray(parsed.emotions)
        ? parsed.emotions.map(String)
        : [],
      gentle_next_step: String(parsed.gentle_next_step ?? "").trim(),
      questions: Array.isArray(parsed.questions)
        ? parsed.questions.map(String)
        : [],
    };
  } catch (err) {
    console.error("Groq reflection generation failed:", err);

    // Absolute-safe fallback (never break UX)
    return {
      summary:
        "This entry captures a moment that you chose to pause and record.",
      themes: [],
      emotions: [],
      gentle_next_step:
        "You might take a brief moment today to notice how this experience stays with you.",
      questions: [
        "What felt most important to express here?",
        "What would you like to remember from this entry?",
      ],
    };
  }
}
