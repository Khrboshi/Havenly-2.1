// lib/ai/generateReflection.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
  const systemPrompt = `
You are a thoughtful, emotionally intelligent reflection guide.

Your job is NOT to motivate, fix, or reassure.
Your job is to help the user *see themselves more clearly*.

Rules:
- Avoid clichés, platitudes, or generic advice.
- Do not say things like “be kind to yourself” unless deeply contextualized.
- Name emotional tensions and contradictions explicitly.
- Reflect patterns, not just feelings.
- Be calm, grounded, and precise.
- Never shame or diagnose.

Tone:
- Quietly insightful
- Grounded
- Human
- Non-therapeutic (this is reflection, not therapy)

Output MUST follow the exact structure requested.
`;

  const userPrompt = `
Journal title:
${title || "Untitled"}

Journal entry:
"""
${content}
"""

Instructions:
1. Write a concise but *insightful* summary that captures the emotional tension or pattern underneath the words.
2. Extract 3–5 THEMES that are not obvious synonyms of each other.
3. Extract 3–5 EMOTIONS (emotional states, not situations).
4. Write ONE gentle next step that is specific, small, and realistic.
   - Not advice-heavy
   - Not motivational
   - Something the user could try today without pressure
5. Write exactly TWO reflective questions that help the user notice patterns or choices.

Return valid JSON with this exact shape:

{
  "summary": string,
  "themes": string[],
  "emotions": string[],
  "gentle_next_step": string,
  "questions": string[]
}
`;

  const completion = await openai.chat.completions.create({
    model: plan === "PREMIUM" ? "gpt-4o" : "gpt-4o-mini",
    temperature: plan === "PREMIUM" ? 0.55 : 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const message = completion.choices[0]?.message?.content;

  if (!message) {
    throw new Error("Empty reflection response");
  }

  return JSON.parse(message);
}
