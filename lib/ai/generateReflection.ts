// lib/ai/generateReflection.ts
// Groq (OpenAI-compatible) reflection generator
// Uses: https://api.groq.com/openai/v1/chat/completions

export type Reflection = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

type Input = {
  title?: string;
  content: string;
  plan: "FREE" | "PREMIUM";
};

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Try to extract JSON if model wrapped it in text
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeList(val: any, max: number): string[] {
  if (!Array.isArray(val)) return [];
  return val
    .map((x) => String(x ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeReflection(r: any): Reflection {
  const summary = typeof r?.summary === "string" ? r.summary.trim() : "";
  const themes = normalizeList(r?.themes, 6);
  const emotions = normalizeList(r?.emotions, 6);
  const gentle_next_step =
    typeof r?.gentle_next_step === "string" ? r.gentle_next_step.trim() : "";
  // ✅ Option A: keep questions at 2–4 (higher quality), and UI label should not hardcode “Two”
  const questions = normalizeList(r?.questions, 4).slice(0, 4);

  return {
    summary: summary || "A reflective summary could not be generated.",
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      gentle_next_step ||
      "Take 2 minutes to write one honest sentence about what you need most right now.",
    questions: questions.length
      ? questions
      : ["What is the smallest next step that would make today feel 1% better?"],
  };
}

export async function generateReflectionFromEntry(
  input: Input
): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  // ✅ Supported Groq model (Mixtral 8x7b 32768 is decommissioned)
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${input.content.trim()}`;

  /**
   * ✅ Havenly Prompt V3
   * Goal: higher-quality, less “AI report” reflections.
   */
  const system = `
You are Havenly — a calm, emotionally intelligent reflection partner.

Your purpose is NOT to analyze the user like a therapist.
Your role is to gently mirror patterns the user may already sense but cannot clearly name.

VOICE & STYLE:
- Speak like a thoughtful inner voice, not a coach or clinician.
- Prefer mirroring over explaining.
- Use precise, human language — avoid abstract psychology jargon.
- Avoid long lectures. Insight should feel quiet and accurate.
- Let tension and contradiction remain; do not try to "solve" the user.

REFLECTION PRINCIPLES:
- Focus on emotional patterns, inner conflicts, or repeated loops.
- Highlight subtle dynamics (safety vs growth, control vs change, momentum vs fear).
- Use the user's actual words and emotional signals whenever possible.
- Avoid generic advice such as "practice self-care" or "stay positive".
- Never diagnose or imply mental health conditions.

STRUCTURE REQUIREMENTS:
- Summary must be 2–4 sentences, emotionally precise and grounded in the entry.
- Themes: 3–6 short concrete phrases.
- Emotions: 3–6 nuanced but simple words.
- Gentle next step: one small action that feels safe and realistic (<10 minutes).
- Questions: 2–4 deep reflective prompts that expand awareness (not productivity).

VERY IMPORTANT:
- Do not sound motivational.
- Do not over-explain what the user already said.
- Aim for clarity that feels slightly surprising but deeply accurate.

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "summary": "2-4 sentence reflective mirror of the core emotional pattern.",
  "themes": ["short concrete themes"],
  "emotions": ["plain language emotions"],
  "gentle_next_step": "one tiny realistic step grounded in the user's context",
  "questions": ["2-4 insightful reflective questions"]
}
`.trim();

  const user = `
User plan: ${input.plan}
Write a reflection for this journal entry.

${entryText}
`.trim();

  // Token budget tuned by plan
  const max_tokens = input.plan === "PREMIUM" ? 800 : 520;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: input.plan === "PREMIUM" ? 0.6 : 0.5,
      max_tokens, // ✅ correct field for Groq chat completions
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      // (Optional) Some OpenAI-compatible providers support this; safe to omit if you want zero risk.
      // response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${text}`);
  }

  const data: any = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";

  const parsed = safeJsonParse<any>(content);
  if (!parsed) {
    // Fail loudly so you see it in logs if model didn’t comply
    throw new Error(`Model returned non-JSON output: ${content.slice(0, 400)}`);
  }

  return normalizeReflection(parsed);
}
