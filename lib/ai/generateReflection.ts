// lib/ai/generateReflection.ts
// Havenly Prompt V6 — Insight Coach (Premium Cognitive Upgrade)
// SAFE: Same schema, same API contract, zero UI break.

export type Reflection = {
  summary: string;
  core_pattern?: string;
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

function normalizeReflection(r: any): Reflection {
  const summary = cleanString(r?.summary);
  const corePattern = cleanString(r?.core_pattern);

  const themesRaw = cleanStringArray(r?.themes, 7);
  const emotionsRaw = cleanStringArray(r?.emotions, 7);
  const nextStep = cleanString(r?.gentle_next_step);
  const questionsRaw = cleanStringArray(r?.questions, 4);

  const themes = themesRaw.length ? themesRaw.slice(0, 6) : [];
  const emotions = emotionsRaw.length ? emotionsRaw.slice(0, 6) : [];

  const questions =
    questionsRaw.length >= 2
      ? questionsRaw.slice(0, 4)
      : [
          "What feels most unresolved for you right now?",
          "What small perspective shift might change how you see this moment?",
        ];

  return {
    summary:
      summary ||
      "A reflective summary could not be generated. Try adding more detail about what felt important.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      "Pause for a moment and write one honest sentence about what you need most right now.",
    questions,
  };
}

export async function generateReflectionFromEntry(
  input: Input
): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${(input.content || "").trim()}`;

  const system = `
You are MindScribe — an emotionally intelligent insight coach.

GOAL:
Move beyond summarizing. Reveal meaningful insight that helps the user think differently.

CRITICAL RULES:
- NEVER invent details. Only reference what is explicitly written.
- If using an example, quote or paraphrase from the entry itself.
- Identify ONE subtle tension or contradiction the user may not fully see yet.

TONE:
Warm, grounded, psychologically perceptive.
NO clinical jargon.
NO generic advice.

INTELLIGENCE LAYER:
Your reflection must include:
1) Emotional validation
2) Hidden pattern or tension
3) Gentle cognitive reframing
4) Tiny forward-thinking prompt

Output JSON ONLY.

Return EXACTLY:
{
  "summary": "3-4 sentences that validate emotion AND introduce a fresh perspective.",
  "core_pattern": "One concise insight revealing a deeper dynamic.",
  "themes": ["3–6 themes"],
  "emotions": ["3–6 nuanced emotions"],
  "gentle_next_step": "A tiny reflective strategy that helps the user think differently, not act drastically.",
  "questions": ["2–4 deep perspective-shifting questions"]
}
`.trim();

  const user = `
User plan: ${input.plan}

Create an Insight Coach reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 900 : 600;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${apiKey}\`,
        },
        body: JSON.stringify({
          model,
          temperature: input.plan === "PREMIUM" ? 0.65 : 0.5,
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
      throw new Error(\`Groq request failed (\${res.status}): \${text}\`);
    }

    const data: any = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";

    const parsed = safeJsonParse<any>(raw);
    if (!parsed) {
      throw new Error(\`Model returned non-JSON output: \${raw.slice(0, 400)}\`);
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
