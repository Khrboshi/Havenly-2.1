// lib/ai/generateReflection.ts

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ReflectionResult = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

type PlanType = "FREE" | "PREMIUM";

function buildPrompt(params: {
  plan: PlanType;
  title?: string;
  content: string;
}) {
  const { plan, title, content } = params;

  if (plan === "PREMIUM") {
    return `
You are a calm, emotionally intelligent reflective companion.

Your role is to help the user gently understand the deeper meaning of what they wrote — not to motivate, judge, diagnose, or problem-solve.

Analyze the journal entry below and respond with:
- A short reflective summary that captures emotional tension or meaning
- 2–4 meaningful themes (not generic)
- 1–3 emotions that are implied or felt
- One gentle next step phrased as an invitation, not advice
- Two thoughtful reflection questions that deepen self-awareness

Avoid clichés, productivity language, or motivational tone.
Do not repeat the entry.
Write with warmth, clarity, and emotional intelligence.

Journal title (optional):
${title ?? "(none)"}

Journal entry:
${content}
`;
  }

  // FREE plan
  return `
You are a gentle reflective assistant.

Provide a simple, supportive reflection on the journal entry below.
Keep insights light and non-intrusive.

Respond with:
- A brief summary
- 1–3 themes
- 1–2 emotions
- One gentle next step
- One or two reflection questions

Journal entry:
${content}
`;
}

export async function generateReflectionFromEntry(params: {
  title?: string;
  content: string;
  plan: PlanType;
}): Promise<ReflectionResult> {
  const prompt = buildPrompt(params);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: params.plan === "PREMIUM" ? 0.6 : 0.8,
    messages: [
      {
        role: "system",
        content:
          "You generate calm, emotionally grounded reflections in structured JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "reflection",
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            themes: {
              type: "array",
              items: { type: "string" },
            },
            emotions: {
              type: "array",
              items: { type: "string" },
            },
            gentle_next_step: { type: "string" },
            questions: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "summary",
            "themes",
            "emotions",
            "gentle_next_step",
            "questions",
          ],
        },
      },
    },
  });

  return response.choices[0].message.parsed as ReflectionResult;
}
