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

function normalizeReflection(r: any): Reflection {
  const summary = typeof r?.summary === "string" ? r.summary.trim() : "";
  const themes = Array.isArray(r?.themes) ? r.themes.map(String).slice(0, 7) : [];
  const emotions = Array.isArray(r?.emotions)
    ? r.emotions.map(String).slice(0, 7)
    : [];
  const gentle_next_step =
    typeof r?.gentle_next_step === "string" ? r.gentle_next_step.trim() : "";
  const questions = Array.isArray(r?.questions)
    ? r.questions.map(String).slice(0, 4)
    : [];

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
   * ✅ Upgraded prompt: removes “AI report” tone and makes reflections feel personal & human.
   */
  const system = `
You are Havenly — a warm, insightful journaling companion.

Your role is NOT to analyze the user from a distance.
Your role is to MIRROR their experience in language that feels personal,
grounded, and emotionally accurate.

Voice Guidelines:
- Speak directly ("You noticed...", "Part of you feels...")
- Avoid clinical or analytical phrases like:
  "It seems that", "There appears to be", "This suggests"
- Sound human, grounded, and emotionally present.
- Reflect tensions and contradictions gently.
- Do NOT diagnose or sound like therapy notes.
- Be concise but emotionally rich.

Depth Rules:
- Identify ONE core pattern or tension if visible.
- Avoid over-explaining or intellectualizing.
- Use the user’s own language where possible.

Action Rules:
- Gentle next step must be:
  * specific
  * small
  * doable today (<10 minutes)

Output MUST be valid JSON ONLY (no markdown, no extra text).

Return JSON schema EXACTLY:
{
  "summary": "2–4 sentences written in direct reflective voice",
  "themes": ["3–6 short themes"],
  "emotions": ["3–6 nuanced emotions"],
  "gentle_next_step": "One tiny concrete action",
  "questions": ["2–4 thoughtful reflective questions"]
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
