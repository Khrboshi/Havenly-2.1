// lib/ai/generateReflection.ts
// Groq (OpenAI-compatible) reflection generator
// Uses: https://api.groq.com/openai/v1/chat/completions :contentReference[oaicite:0]{index=0}

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
  const emotions = Array.isArray(r?.emotions) ? r.emotions.map(String).slice(0, 7) : [];
  const gentle_next_step =
    typeof r?.gentle_next_step === "string" ? r.gentle_next_step.trim() : "";
  const questions = Array.isArray(r?.questions)
    ? r.questions.map(String).slice(0, 4)
    : [];

  return {
    summary: summary || "A reflective summary could not be generated.",
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step: gentle_next_step || "Take 2 minutes to write one honest sentence about what you need most right now.",
    questions: questions.length
      ? questions
      : ["What is the smallest next step that would make today feel 1% better?"],
  };
}

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  // ✅ Use a currently supported Groq model (Mixtral 8x7b 32768 is decommissioned)
  // Groq docs show examples like llama-3.3-70b-versatile. :contentReference[oaicite:1]{index=1}
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${input.content.trim()}`;

  // Stronger prompt to avoid shallow/obvious outputs
  const system = `
You are Havenly, a careful reflective journaling assistant.
Goal: help the user understand patterns, name what matters, and suggest a tiny, realistic next step.

Rules:
- Be compassionate, practical, and specific.
- Do NOT diagnose. Do NOT mention therapy unless the user asks.
- Avoid generic phrases (e.g., "practice self-care" without specifics).
- Extract meaning from the user's exact words and details.
- Output MUST be valid JSON ONLY (no markdown, no extra text).

Return JSON schema EXACTLY:
{
  "summary": "2-4 sentences. Mirror key tensions + what seems important.",
  "themes": ["3-6 short themes, concrete"],
  "emotions": ["3-6 emotions, nuanced but plain"],
  "gentle_next_step": "One small action in <10 minutes, starts today, very specific",
  "questions": ["2-4 targeted questions that unlock insight (not generic)"]
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
      max_tokens, // ✅ correct field for chat completions (NOT max_completion_tokens)
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
  const content: string =
    data?.choices?.[0]?.message?.content ?? "";

  const parsed = safeJsonParse<any>(content);
  if (!parsed) {
    // If the model didn't comply, fail loudly so you see it in logs
    throw new Error(`Model returned non-JSON output: ${content.slice(0, 400)}`);
  }

  return normalizeReflection(parsed);
}
