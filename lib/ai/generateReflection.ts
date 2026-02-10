// lib/ai/generateReflection.ts
import Groq from "groq-sdk";

export type Reflection = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[]; // keep exactly 2 for UI consistency
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
    return null;
  }
}

function normalizeArrayStrings(v: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(v)) return fallback;
  return v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function normalizeQuestions(v: unknown): string[] {
  const arr = normalizeArrayStrings(v, []);
  // force exactly 2 questions (your UI says "Two questions")
  if (arr.length >= 2) return arr.slice(0, 2);
  if (arr.length === 1) return [arr[0], "What would feel like a small, realistic next step this week?"];
  return [
    "What feels most important underneath what you wrote?",
    "What is one small, realistic step you could take in the next 24 hours?",
  ];
}

function buildPrompt({ title, content, plan }: Input) {
  const depth =
    plan === "PREMIUM"
      ? "Go deeper. Name tensions, patterns, and possible needs. Offer nuanced, specific language."
      : "Be concise but still specific. Avoid generic advice.";

  return {
    system: [
      "You are Havenly, a calm and insightful journaling companion.",
      "You must return ONLY valid JSON. No markdown, no extra text.",
      "Tone: warm, non-clinical, grounded. Avoid therapy disclaimers.",
      "Never mention model names, pricing, tokens, or providers.",
      "No diagnoses. No moralizing.",
      "",
      "Output JSON schema:",
      "{",
      '  "summary": string (1–2 sentences, reflective + specific),',
      '  "themes": string[] (3–6 items, concrete phrases),',
      '  "emotions": string[] (3–6 items, plain emotion words),',
      '  "gentle_next_step": string (1 practical step, small + doable in <15 minutes),',
      '  "questions": string[] (EXACTLY 2 questions, open-ended, not yes/no)',
      "}",
    ].join("\n"),
    user: [
      depth,
      "",
      "Journal entry:",
      `Title: ${title?.trim() ? title.trim() : "(none)"}`,
      "Content:",
      content,
    ].join("\n"),
  };
}

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const groq = new Groq({ apiKey });

  // ✅ Updated models (Mixtral 8x7b 32768 is deprecated/removed)
  // - FREE: fast/cheap
  // - PREMIUM: higher quality
  const model =
    input.plan === "PREMIUM" ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";

  const { system, user } = buildPrompt(input);

  const completion = await groq.chat.completions.create({
    model,
    temperature: input.plan === "PREMIUM" ? 0.6 : 0.5,
    max_completion_tokens: input.plan === "PREMIUM" ? 700 : 450,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content?.trim() ?? "";
  const parsed = safeJsonParse<Partial<Reflection>>(raw);

  // If the model returns non-JSON for any reason, fail loudly (your route already catches)
  if (!parsed) {
    throw new Error(`Model returned non-JSON: ${raw.slice(0, 300)}`);
  }

  const reflection: Reflection = {
    summary: normalizeString(parsed.summary, "A reflective summary wasn't available this time."),
    themes: normalizeArrayStrings(parsed.themes, ["reflection", "self-awareness", "daily life"]),
    emotions: normalizeArrayStrings(parsed.emotions, ["curious", "tired", "uncertain"]),
    gentle_next_step: normalizeString(
      parsed.gentle_next_step,
      "Take 10 minutes to write what you most want right now, without judging it."
    ),
    questions: normalizeQuestions(parsed.questions),
  };

  return reflection;
}
