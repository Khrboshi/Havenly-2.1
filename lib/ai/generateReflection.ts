// lib/ai/generateReflection.ts
// Havenly Prompt V7.2 — Reliability Upgrade (Auto-retry + Better JSON enforcement)
// BUILD SAFE, SAME SCHEMA, NEVER CRASH

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
  // Removes ```json ... ``` or ``` ... ```
  return raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();
}

function normalizeQuotes(raw: string): string {
  // Replace “ ” ‘ ’ with plain quotes to reduce JSON parse failures
  return raw
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function extractJsonObject(raw: string): string | null {
  // Tries to extract the broadest JSON object region { ... }
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
          "What feels most unresolved for you right now?",
          "What are you hoping your partner understands about your intention?",
          "What would “enough” look like in this situation, realistically?",
          "Next time, capture the exact moment you felt the shift and what happened right before it.",
        ];

  return {
    summary:
      summary ||
      "I’m preparing a clearer reflection from what you wrote. If you try again, the next pass is usually more specific and useful.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      'Write one sentence: "What I did, what I hoped it meant, and what I needed back."',
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

  // V7.2: Less brittle than V7.
  // - Still grounded: "use exact phrase IF you include a detail", but not mandatory.
  // - Adds Strategy A/B in gentle_next_step.
  // - Last question MUST start with "Next time," for retention loop.
  const systemBase = `
You are MindScribe — an emotionally intelligent insight coach.

GROUNDING (TRUST) RULE:
- NEVER invent details.
- If you mention a specific event/detail, include an exact short phrase from the entry in quotation marks.
- If you cannot confidently quote it, stay general rather than guessing.

GOAL:
Help the user feel understood AND gain clarity.
Go beyond summary: name one underlying tension and offer a tiny strategy.

TONE:
Warm, grounded, direct.
No clinical jargon.
No generic advice.
No flattery.

OUTPUT RULES (VERY IMPORTANT):
- Output MUST be valid JSON ONLY.
- Use DOUBLE QUOTES for all JSON strings.
- No markdown. No code fences. No extra text before or after JSON.

Return EXACTLY this schema:
{
  "summary": "3–5 sentences. Validate + add a reframing perspective.",
  "core_pattern": "One concise sentence describing the deeper dynamic.",
  "themes": ["3–6 short themes"],
  "emotions": ["3–6 nuanced emotions"],
  "gentle_next_step": "A tiny strategy with two options labeled 'Option A:' and 'Option B:'. PREMIUM adds a short script line.",
  "questions": ["2–4 deep questions. The LAST question must start with: 'Next time,'"]
}
`.trim();

  const user = `
User plan: ${input.plan}

Create a MindScribe V7.2 reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1000 : 650;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  async function callGroq(args: {
    temperature: number;
    system: string;
  }): Promise<string> {
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
    // Attempt #1 (normal)
    const raw1 = await callGroq({
      temperature: input.plan === "PREMIUM" ? 0.6 : 0.45,
      system: systemBase,
    });

    const parsed1 = parseModelJson<any>(raw1);
    if (parsed1) return normalizeReflection(parsed1);

    // Attempt #2 (auto-retry, stricter)
    const systemRetry = `
${systemBase}

RETRY INSTRUCTION:
Your previous output was not valid JSON.
Now output ONLY valid JSON with the exact schema.
No extra commentary. No markdown. Use double quotes.
`.trim();

    const raw2 = await callGroq({
      temperature: 0.2, // lower creativity => higher format compliance
      system: systemRetry,
    });

    const parsed2 = parseModelJson<any>(raw2);
    if (parsed2) return normalizeReflection(parsed2);

    // Final fallback (never crash, premium-friendly wording)
    return normalizeReflection({
      summary:
        "Your entry deserves a precise reflection. I’m not showing a rushed result. Tap generate again, or shorten the entry to the single key moment for maximum clarity.",
      core_pattern:
        "The system paused to refine the emotional pattern before presenting a clearer reflection.",
      themes: ["reflection"],
      emotions: ["neutral"],
      gentle_next_step:
        "Option A: Tap generate again (the next pass is usually more specific). Option B: Copy only the key paragraph and regenerate for sharper insight.",
      questions: [
        "What is the single moment in your entry that carries the most weight?",
        "What do you most want your partner to understand about your intention?",
        "What outcome would feel fair and stable for you?",
        "Next time, paste the exact sentence that hurt most and your immediate reaction.",
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
        "Option A: Tap generate again. Option B: Retry after 30 seconds if you’re on a slow connection.",
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
