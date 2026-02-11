// lib/ai/generateReflection.ts
// Havenly Prompt V4 – Stable Version (with optional core_pattern support)

export type Reflection = {
  summary: string;
  core_pattern?: string; // ✅ NEW (optional so nothing crashes)
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
  return {
    summary:
      typeof r?.summary === "string"
        ? r.summary.trim()
        : "A reflective summary could not be generated.",

    // ✅ safe optional core_pattern (no crashes if missing)
    core_pattern:
      typeof r?.core_pattern === "string"
        ? r.core_pattern.trim()
        : undefined,

    themes: Array.isArray(r?.themes)
      ? r.themes.map(String).slice(0, 7)
      : ["reflection"],

    emotions: Array.isArray(r?.emotions)
      ? r.emotions.map(String).slice(0, 7)
      : ["neutral"],

    gentle_next_step:
      typeof r?.gentle_next_step === "string"
        ? r.gentle_next_step.trim()
        : "Take 2 minutes to write one honest sentence about what you need most right now.",

    questions: Array.isArray(r?.questions)
      ? r.questions.map(String).slice(0, 4)
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

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim()
    ? `Title: ${input.title.trim()}\n`
    : "";

  const entryText = `${titleLine}Entry:\n${input.content.trim()}`;

  // ⭐ Havenly Prompt V4 (Core Pattern Enabled)
  const system = `
You are Havenly — a warm, emotionally intelligent journaling companion.

Speak directly to the user in a grounded, human voice.

Rules:
- Avoid clinical language.
- Avoid phrases like "it seems that".
- Mirror tensions gently.
- Focus on ONE core pattern if visible.
- Do NOT diagnose or sound like therapy notes.

Output MUST be valid JSON only.

Return EXACTLY:
{
  "summary": "2–4 sentence reflection",
  "core_pattern": "one concise sentence describing the central pattern or tension",
  "themes": ["3–6 themes"],
  "emotions": ["3–6 emotions"],
  "gentle_next_step": "one tiny action under 10 minutes",
  "questions": ["2–4 thoughtful reflective questions"]
}
`.trim();

  const user = `
User plan: ${input.plan}

Write a Havenly reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 800 : 520;

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: input.plan === "PREMIUM" ? 0.6 : 0.5,
        max_tokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${text}`);
  }

  const data: any = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";

  const parsed = safeJsonParse<any>(content);
  if (!parsed) {
    throw new Error(`Model returned non-JSON output: ${content.slice(0, 400)}`);
  }

  return normalizeReflection(parsed);
}
