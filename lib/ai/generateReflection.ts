// lib/ai/generateReflection.ts
// Havenly Prompt V5 — "The Deep Listener" (Smart & Touching)
// Groq (OpenAI-compatible): https://api.groq.com/openai/v1/chat/completions

export type Reflection = {
  summary: string;
  core_pattern?: string; // optional so UI never crashes if missing
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
    // Try to extract JSON if the model wrapped it in text
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

function cleanString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function cleanStringArray(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    const s = String(item ?? "").trim();
    if (!s) continue;
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * UX constraints:
 * - core_pattern: optional
 * - questions: Option A => keep 2–4
 */
function normalizeReflection(r: any): Reflection {
  const summary = cleanString(r?.summary);
  const corePattern = cleanString(r?.core_pattern);

  const themesRaw = cleanStringArray(r?.themes, 7);
  const emotionsRaw = cleanStringArray(r?.emotions, 7);
  const nextStep = cleanString(r?.gentle_next_step);
  const questionsRaw = cleanStringArray(r?.questions, 4);

  // Prefer 3–6 for display
  const themes = themesRaw.length ? themesRaw.slice(0, 6) : [];
  const emotions = emotionsRaw.length ? emotionsRaw.slice(0, 6) : [];

  // Option A: keep 2–4 questions
  const questions =
    questionsRaw.length >= 2
      ? questionsRaw.slice(0, 4)
      : [
          "What part of today felt the most true, even if it was small?",
          "If you could be gentle with yourself for 10 minutes, what would you do?",
        ];

  return {
    summary:
      summary ||
      "A reflective summary could not be generated. Try adding a bit more detail about what you felt and what mattered.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      "Take 2 minutes to write one honest sentence about what you need most right now.",
    questions,
  };
}

export async function generateReflectionFromEntry(
  input: Input
): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  // Use the smartest model available for nuance
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${(input.content || "").trim()}`;

  // PROMPT ENGINEERED FOR "TOUCHING" & "SMART" NUANCE
  const system = `
You are MindScribe — a highly perceptive, emotionally intelligent psychological companion.
Your goal is not just to summarize, but to make the user feel deeply "seen" and "understood."

CRITICAL INSTRUCTION:
- PROVE YOU LISTENED: You MUST reference 1 specific tiny detail or anecdote from the text (e.g., "driving in that storm," "the specific gift you bought," "the way they replied"). Do not remain abstract.
- VALIDATE INTENT: If the user describes a conflict, acknowledge their *good intentions* first (e.g., "You were trying to keep them safe," "You wanted to show love").
- MATCH THE DEPTH: If the user writes a long, painful entry, match their seriousness. Do not be overly cheerful.

TONE RULES:
- Warm, grounded, and curious.
- NO clinical language ("cognitive dissonance," "maladaptive").
- NO generic advice ("You should talk to them").
- NO pleasing/fawning ("You are so brave!"). Just validate the reality.

Output MUST be valid JSON only.

Return EXACTLY this schema:
{
  "summary": "3-4 sentences. Start by validating the specific struggle using a detail from the text. Then gently mirror the underlying emotion without judgment.",
  "core_pattern": "One concise sentence identifying the hidden tension (e.g., 'The gap between your way of showing love and how it is received').",
  "themes": ["3–6 short themes"],
  "emotions": ["3–6 nuanced emotions"],
  "gentle_next_step": "One tiny, low-pressure thinking task. Do not ask them to 'do' something big.",
  "questions": ["2–4 deep, specific questions that invite them to look at the situation from a new angle"]
}
`.trim();

  // We feed the plan to the prompt so the AI knows if it can go deeper
  const user = `
User plan: ${input.plan}

Write a MindScribe reflection for this journal entry:

${entryText}
`.trim();

  // Increased tokens slightly to allow for the deeper explanation
  const max_tokens = input.plan === "PREMIUM" ? 1024 : 650;

  const controller = new AbortController();
  const timeoutMs = 30_000; // Gave it 5 more seconds for "thinking"
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        // Premium gets slightly higher creativity (temperature) for "Smart" insights
        temperature: input.plan === "PREMIUM" ? 0.65 : 0.5,
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
    const raw: string = data?.choices?.[0]?.message?.content ?? "";

    const parsed = safeJsonParse<any>(raw);
    if (!parsed) {
      throw new Error(`Model returned non-JSON output: ${raw.slice(0, 400)}`);
    }

    return normalizeReflection(parsed);
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Groq request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
