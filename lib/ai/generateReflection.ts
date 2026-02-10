import Groq from "groq-sdk";

type ReflectionInput = {
  content: string;
  title?: string;
  plan: "FREE" | "PREMIUM";
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generateReflectionFromEntry({
  content,
  title,
  plan,
}: ReflectionInput) {
  const systemPrompt = `
You are an emotionally intelligent reflection partner.

You must respond with VALID JSON ONLY.
Do not include markdown.
Do not include explanations.
Do not include text outside JSON.

This is not therapy.
Do not diagnose.
Be thoughtful, human, and specific.
`;

  const userPrompt = `
Journal title:
"${title || "Untitled"}"

Journal entry:
"""
${content}
"""

Return JSON in this exact shape:

{
  "summary": "2–3 sentences capturing the emotional core",
  "themes": ["3–5 emotionally meaningful themes"],
  "emotions": ["3–5 nuanced emotions"],
  "gentle_next_step": "One small, realistic step for today",
  "questions": [
    "Insightful question",
    "Self-compassion question",
    "Direction or meaning question"
  ]
}
`;

  const completion = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    temperature: plan === "PREMIUM" ? 0.8 : 0.6,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("Groq returned empty response");
  }

  // 🔒 SAFETY: extract JSON even if model adds text
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("Groq non-JSON output:", raw);
    throw new Error("Groq did not return JSON");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("JSON parse failed:", jsonMatch[0]);
    throw new Error("Invalid JSON from Groq");
  }
}
