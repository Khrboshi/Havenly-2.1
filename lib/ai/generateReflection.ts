// lib/ai/generateReflection.ts
// Havenly Prompt V7 — Insight + Strategy + Retention (BUILD SAFE, SAME SCHEMA)

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
          "If you zoom out one year, what would you wish you had protected or clarified?",
          "Next time, what specific moment (their words + your reaction) should you capture so we can map the pattern more precisely?",
        ];

  return {
    summary:
      summary ||
      "A reflective summary could not be generated. Try adding more detail about what happened and what you felt.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      "Take 2 minutes to write one sentence: “What I wanted to give, what I hoped it would mean, and what I needed back.”",
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

  // V7 Prompt: adds Strategy + Retention loop while keeping SAME output fields.
  const system = `
You are MindScribe — an emotionally intelligent insight coach.

NON-NEGOTIABLE TRUTH RULE:
- NEVER invent details.
- If you reference a specific detail, you MUST quote an exact phrase from the entry (3–12 words) in quotation marks.
- If you cannot quote, stay general rather than guessing.

GOAL:
Go beyond summarizing. Create a meaningful shift in how the user understands the situation.

OUTPUT STYLE:
Warm, grounded, direct.
NO clinical jargon.
NO generic advice.
NO flattery.

DEPTH RULE:
- If the entry is long/emotional, match its seriousness.
- Identify ONE hidden tension (a “why this keeps hurting” dynamic).
- Offer a tiny strategy (two micro-options) that the user can try mentally or conversationally.

PLAN DIFFERENTIATION:
- FREE: insightful, brief, still grounded.
- PREMIUM: higher precision:
  - name the tension more sharply,
  - include two micro-options in gentle_next_step,
  - include one “script line” the user could say (short, non-pushy).

Output JSON ONLY. No markdown. No extra text.

Return EXACTLY this schema:
{
  "summary": "3–5 sentences. Start with validation + an exact quoted detail. Then add a reframing sentence that changes perspective.",
  "core_pattern": "One concise sentence describing the deeper dynamic.",
  "themes": ["3–6 short themes"],
  "emotions": ["3–6 nuanced emotions"],
  "gentle_next_step": "A tiny strategy with two options (A/B). PREMIUM must include a 1–2 sentence script line.",
  "questions": ["2–4 deep questions. The LAST question must be a retention hook starting with: 'Next time,'"]
}
`.trim();

  const user = `
User plan: ${input.plan}

Create a MindScribe V7 reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1050 : 650;
  const temperature = input.plan === "PREMIUM" ? 0.65 : 0.5;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

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
        temperature,
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
