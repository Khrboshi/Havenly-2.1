// lib/ai/generateReflection.ts
// Havenly Prompt V7.1 — Insight + Strategy + Retention + NO-CRASH Fallback
// BUILD SAFE, SAME SCHEMA

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
      'Take 2 minutes to write one sentence: "What I wanted to give, what I hoped it would mean, and what I needed back."',
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
      // NO-CRASH fallback on upstream errors
      return normalizeReflection({
        summary:
          "The reflection service had a temporary issue generating a structured result. Your entry still matters, and you can try again in a moment.",
        core_pattern:
          "A meaningful pattern may be present, but the system could not safely format it right now.",
        themes: ["reflection"],
        emotions: ["neutral"],
        gentle_next_step:
          "Wait 30 seconds and try again. If it repeats, shorten the entry to the key moment and retry.",
        questions: [
          "What is the single moment in your entry that carries the most weight?",
          "What do you wish the other person understood about your intention?",
          "What would a ‘good enough’ outcome look like for you?",
          "Next time, paste the exact sentence that hurt most and what you felt in your body when you read/heard it.",
        ],
      });
    }

    const data: any = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";

    const parsed = safeJsonParse<any>(raw);

    if (!parsed) {
      // SAFETY FALLBACK — never crash production on non-JSON model output
      return normalizeReflection({
        summary:
          "Something meaningful was detected in your writing, but the reflection couldn't be safely structured this time. Please try generating again.",
        core_pattern:
          "The system detected emotional complexity but could not safely format a full reflection.",
        themes: ["reflection"],
        emotions: ["neutral"],
        gentle_next_step:
          "Try again once. If it repeats, shorten the entry to 6–10 lines focusing on the key moment.",
        questions: [
          "What part of what you wrote feels most important right now?",
          "If you rewrote one sentence more clearly, what would it be?",
          "What do you most want your partner to understand about your intention?",
          "Next time, include the exact words said and your immediate reaction so we can map the pattern precisely.",
        ],
      });
    }

    return normalizeReflection(parsed);
  } catch (err: any) {
    if (err?.name === "AbortError") {
      // NO-CRASH fallback on timeouts
      return normalizeReflection({
        summary:
          "The reflection request timed out. Your entry is still saved, and you can try again.",
        core_pattern:
          "The system could not complete processing within the time limit.",
        themes: ["reflection"],
        emotions: ["neutral"],
        gentle_next_step:
          "Try again once. If it keeps timing out, shorten the entry and retry.",
        questions: [
          "What is the core question you want answered in one sentence?",
          "What feels most confusing right now?",
          "What would ‘enough’ look like for you in this situation?",
          "Next time, paste only the key paragraph and what you want clarity on.",
        ],
      });
    }

    // Final safety fallback for unknown errors
    return normalizeReflection({
      summary:
        "The reflection could not be generated due to a temporary error. Please try again.",
      core_pattern:
        "A system error occurred while generating the reflection.",
      themes: ["reflection"],
      emotions: ["neutral"],
      gentle_next_step:
        "Try again in a minute. If it repeats, report the time and entry title.",
      questions: [
        "What is the main feeling you want help naming right now?",
        "What outcome are you hoping for?",
        "What are you afraid might be true?",
        "Next time, capture the exact moment you felt the shift and what happened right before it.",
      ],
    });
  } finally {
    clearTimeout(timeout);
  }
}
