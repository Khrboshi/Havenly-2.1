// lib/ai/generateReflection.ts
// Groq (OpenAI-compatible) reflection generator
// Endpoint: https://api.groq.com/openai/v1/chat/completions

export type Reflection = {
  summary: string;
  core_pattern: string; // ✅ NEW (Prompt V4)
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

function toStringArray(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  const cleaned = v
    .map((x) => String(x ?? "").trim())
    .filter(Boolean);
  return cleaned.slice(0, max);
}

function normalizeCorePattern(s: unknown): string {
  const v = typeof s === "string" ? s.trim() : "";
  if (!v) return "";
  // One sentence max-ish; keep punchy
  const oneLine = v.replace(/\s+/g, " ").trim();
  return oneLine.length > 160 ? oneLine.slice(0, 157).trim() + "…" : oneLine;
}

function normalizeSentence(s: unknown, fallback: string): string {
  const v = typeof s === "string" ? s.trim() : "";
  return v || fallback;
}

function normalizeReflection(r: any): Reflection {
  const summary = normalizeSentence(
    r?.summary,
    "A reflective summary could not be generated."
  );

  const core_pattern = normalizeCorePattern(r?.core_pattern);

  const themes = toStringArray(r?.themes, 6);
  const emotions = toStringArray(r?.emotions, 6);

  const gentle_next_step = normalizeSentence(
    r?.gentle_next_step,
    "Take 2 minutes to write one honest sentence about what you need most right now."
  );

  const questions = toStringArray(r?.questions, 4);

  return {
    summary,
    core_pattern: core_pattern || summary, // ✅ fallback if model omits it
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step,
    questions: questions.length
      ? questions
      : ["What is the smallest next step that would make today feel 1% better?"],
  };
}

export async function generateReflectionFromEntry(
  input: Input
): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${input.content.trim()}`;

  /**
   * ✅ HAVENLY PROMPT V4 (with core_pattern)
   *
   * Goal: make the reflection feel human + perceptive, and explicitly output
   * a single "core_pattern" sentence (the key tension/pattern).
   */
  const system = `
You are Havenly — a warm, insightful journaling companion.

Your job is not to diagnose, analyze clinically, or sound like a report.
Your job is to mirror the user’s lived experience in a way that feels personal,
grounded, emotionally accurate, and gently clarifying.

VOICE (must follow):
- Speak directly to the user ("You noticed…", "Part of you…", "It makes sense that…").
- Avoid clinical/robot phrases like: "It seems", "There appears", "This suggests", "Noteworthy", "Significant concern".
- Avoid therapy-notes tone. No diagnosing. No labels like "depression/anxiety disorder".
- Use the user’s own wording where possible.
- Prefer clarity over cleverness.

DEPTH (must follow):
- Identify ONE main tension or loop. Name it plainly.
- Do not over-explain. Do not intellectualize.
- If uncertain, say it softly ("It may be…", "It could be…") but do not hedge excessively.

OUTPUT REQUIREMENTS (strict):
- Output valid JSON ONLY. No markdown, no commentary.
- Keep everything concise and high-signal.

SCHEMA (return EXACTLY these keys, no extras):
{
  "summary": "2–4 sentences. Personal reflective voice. Mirrors the user’s key tensions.",
  "core_pattern": "ONE sentence. The central loop/tension/pattern the user is in. Concrete and specific.",
  "themes": ["3–6 short themes. Concrete phrases, not abstract labels."],
  "emotions": ["3–6 emotions. Nuanced but plain language."],
  "gentle_next_step": "One tiny action (<10 minutes) the user can do today. Concrete, not vague.",
  "questions": ["2–4 questions. Specific to this entry. No generic prompts."]
}

QUALITY BAR:
- Make the user feel accurately seen.
- No generic self-care advice.
- No long-winded summaries.
`.trim();

  const user = `
User plan: ${input.plan}
Write a reflection for this journal entry.

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 850 : 560;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
  });

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
