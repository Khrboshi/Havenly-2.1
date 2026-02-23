// lib/ai/generateReflection.ts
// Havenly Prompt V8 — Premium Voice + High Reliability (Auto-retry + No-crash)
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

function stripCodeFences(raw: string): string {
  return raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();
}

function normalizeQuotes(raw: string): string {
  return raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function extractJsonObject(raw: string): string | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return raw.slice(start, end + 1);
  return null;
}

function parseModelJson<T>(raw: string): T | null {
  const cleaned = normalizeQuotes(stripCodeFences(raw));
  const direct = safeJsonParse<T>(cleaned);
  if (direct) return direct;

  const extracted = extractJsonObject(cleaned);
  if (!extracted) return null;

  return safeJsonParse<T>(extracted);
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
          "What part of this situation feels most painful or unfair to you?",
          "What would ‘enough’ look like for you in this relationship, in plain words?",
          "What is one boundary or request you could name without blaming anyone?",
          "Next time, capture the exact words that triggered you and what you did right after.",
        ];

  return {
    summary:
      summary ||
      "I can see there’s something important here. If you tap generate again, I’ll aim for a clearer, more specific reflection.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      'Option A: Write one sentence: "What I did, what I hoped it meant, and what I needed back." Option B: Copy only the key paragraph and generate again for sharper focus.',
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

  const systemBase = `
You are MindScribe — a premium reflection coach.

VOICE RULE (CRITICAL):
- Write directly to the person as "you". Never say "the user", "the person", "they", or "this user".
- Keep it human and grounded, not like a report.

TRUTH / SAFETY RULE:
- Never invent details.
- If you refer to a concrete moment, anchor it by quoting a short exact phrase from the entry in quotation marks.
- If you cannot quote it confidently, stay general.

GOAL:
Help the person feel seen AND gain clarity.
Move beyond summary: name one underlying tension and offer a small strategy.

TONE:
Warm, steady, specific.
No clinical jargon.
No generic advice.
No flattery.

OUTPUT RULES (VERY IMPORTANT):
- Output MUST be valid JSON ONLY.
- Use DOUBLE QUOTES for all JSON strings.
- No markdown, no code fences, no extra text before or after JSON.

STRUCTURE REQUIREMENTS:
- summary: 3–5 sentences. Start with validation + what’s at stake. Add one reframing sentence.
- core_pattern: one sentence naming the deeper dynamic.
- gentle_next_step: MUST include "Option A:" and "Option B:".
- questions: 2–4 questions. The LAST question MUST start with "Next time,".

PLAN DIFFERENTIATION:
- FREE: helpful, concise, still specific.
- PREMIUM: add sharper reframing + one short script line (1–2 sentences) inside gentle_next_step.

Return EXACTLY this schema:
{
  "summary": "…",
  "core_pattern": "…",
  "themes": ["…"],
  "emotions": ["…"],
  "gentle_next_step": "…",
  "questions": ["…"]
}
`.trim();

  const user = `
User plan: ${input.plan}

Create a MindScribe V8 reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 950 : 650;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  async function callGroq(args: { temperature: number; system: string }) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: args.temperature,
        max_tokens,
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Groq request failed (${res.status}): ${text}`);
    }

    const data: any = await res.json();
    return String(data?.choices?.[0]?.message?.content ?? "");
  }

  try {
    // Attempt #1
    const raw1 = await callGroq({
      temperature: input.plan === "PREMIUM" ? 0.55 : 0.4,
      system: systemBase,
    });

    const parsed1 = parseModelJson<any>(raw1);
    if (parsed1) return normalizeReflection(parsed1);

    // Attempt #2 (auto-retry: stricter + lower temperature)
    const systemRetry = `
${systemBase}

RETRY INSTRUCTION:
Your previous output was not valid JSON.
Now output ONLY valid JSON with the exact schema.
No extra commentary. No markdown. Use double quotes only.
`.trim();

    const raw2 = await callGroq({
      temperature: 0.2,
      system: systemRetry,
    });

    const parsed2 = parseModelJson<any>(raw2);
    if (parsed2) return normalizeReflection(parsed2);

    // Final fallback: premium-safe language
    return normalizeReflection({
      summary:
        "Your entry is worth a precise reflection, and I’m not going to give you a sloppy one. Tap generate again, or paste only the key paragraph so I can lock onto the strongest signal.",
      core_pattern:
        "The reflection needed an extra pass to format cleanly without losing nuance.",
      themes: ["reflection"],
      emotions: ["neutral"],
      gentle_next_step:
        input.plan === "PREMIUM"
          ? 'Option A: Tap generate again for a cleaner, more specific pass. Option B: Paste only the key paragraph and regenerate. Script line: "I want to understand what ‘effort’ means to you, because I’m trying — and I keep feeling like it doesn’t land."'
          : "Option A: Tap generate again. Option B: Paste only the key paragraph and regenerate for sharper focus.",
      questions: [
        "What feels most painful or unfair to you right now?",
        "What do you wish your partner understood about your intention?",
        "What would ‘enough’ look like for you, in one sentence?",
        "Next time, paste the exact words that triggered you and what you did right after.",
      ],
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return normalizeReflection({
        summary:
          "This reflection needs a second pass for clarity, but the request timed out. Your entry is saved — try again once.",
        core_pattern:
          "The system could not complete processing within the time limit.",
        themes: ["reflection"],
        emotions: ["neutral"],
        gentle_next_step:
          "Option A: Tap generate again. Option B: Shorten the entry to 6–10 lines and regenerate for faster clarity.",
        questions: [
          "What is the core question you want answered in one sentence?",
          "What feels most confusing right now?",
          "What would ‘enough’ look like for you in this situation?",
          "Next time, include the exact words said and what you felt immediately after.",
        ],
      });
    }

    return normalizeReflection({
      summary:
        "I couldn’t complete a clean reflection on this pass, but your entry is saved. Try again — the next pass usually lands better.",
      core_pattern:
        "A temporary system issue prevented a fully structured reflection.",
      themes: ["reflection"],
      emotions: ["neutral"],
      gentle_next_step:
        "Option A: Tap generate again. Option B: Retry after 30 seconds if your connection is slow.",
      questions: [
        "What part of what you wrote feels most important right now?",
        "What do you wish the other person understood about your intention?",
        "What are you afraid might be true here?",
        "Next time, capture the exact moment the tone changed and what was said.",
      ],
    });
  } finally {
    clearTimeout(timeout);
  }
}
