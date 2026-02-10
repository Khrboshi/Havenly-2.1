// lib/ai/generateReflection.ts

type ReflectionInput = {
  content: string;
  title?: string;
  plan: "FREE" | "PREMIUM";
};

export async function generateReflectionFromEntry({
  content,
  title,
  plan,
}: ReflectionInput) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const systemPrompt = `
You are a calm, emotionally intelligent reflection guide.

Your role:
- Reflect patterns, tensions, and emotional signals back to the user
- Avoid clichés, platitudes, or motivational language
- Do not "fix" the user
- Name contradictions gently and clearly
- Be specific to what is written, not generic
- Use grounded, human language

Never diagnose. Never shame.
Return valid JSON only.
`;

  const userPrompt = `
Journal title:
${title || "Untitled"}

Journal entry:
"""
${content}
"""

Return ONLY valid JSON in this exact shape:

{
  "summary": string,
  "themes": string[],
  "emotions": string[],
  "gentle_next_step": string,
  "questions": string[]
}
`;

  const model =
    plan === "PREMIUM"
      ? "llama-3.1-70b-versatile"
      : "llama-3.1-8b-instant";

  const temperature = plan === "PREMIUM" ? 0.45 : 0.6;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const contentMessage = data?.choices?.[0]?.message?.content;

  if (!contentMessage) {
    throw new Error("Empty reflection response from Groq");
  }

  return JSON.parse(contentMessage);
}
