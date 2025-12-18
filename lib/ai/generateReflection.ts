// lib/ai/generateReflection.ts

import Groq from "groq-sdk";

export type ReflectionResult = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

type PlanType = "FREE" | "PREMIUM";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function buildPrompt(params: {
  plan: PlanType;
  title?: string;
  content: string;
}) {
  const { plan, title, content } = params;

  if (plan === "PREMIUM") {
    return `
You are a calm, emotionally intelligent reflective companion.

Rules:
- Base everything strictly on what the user actually wrote.
- Do NOT invent events, causes, or emotions.
- Avoid generic therapy language.
- Be specific, grounded, and humane.

Respond ONLY with valid JSON in this exact structure:
{
  "summary": string,
  "themes": string[],
  "emotions": string[],
  "gentle_next_step": string,
  "questions": string[]
}

Journal title:
${title ?? "(none)"}

Journal entry:
${content}
`;
  }

  // FREE plan
  return `
You are a gentle reflective assistant.

Provide a light, supportive reflection.
Do not over-analyze or add depth that is not present.

Respond ONLY with valid JSON in this exact structure:
{
  "summary": string,
  "themes": string[],
  "emotions": string[],
  "gentle_next_step": string,
  "questions": string[]
}

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

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: params.plan === "PREMIUM" ? 0.4 : 0.6,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "You generate calm, grounded journaling reflections in strict JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
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
    console.error("Groq reflection failed:", err);

    // Absolute-safe fallback
    return {
      summary:
        "This entry captures a moment you chose to pause and reflect on.",
      themes: [],
      emotions: [],
      gentle_next_step:
        "You might take a brief moment today to notice how this stays with you.",
      questions: [
        "What felt most important to express here?",
        "What would you like to remember from this entry?",
      ],
    };
  }
}
