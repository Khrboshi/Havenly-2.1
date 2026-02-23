// lib/ai/generateReflection.ts
// Havenly Prompt V10.1 — Premium Perception Multiplier (Wise Mirror + Auto-Retry + No-Crash)
// BUILD SAFE, SAME SCHEMA
//
// Change vs V10: relax "must quote" rule to allow paraphrased specific moments,
// preventing generic outputs and improving premium perceived intelligence.

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
          "What is the real need underneath what you wrote (respect, reassurance, appreciation, safety, clarity)?",
          "What would ‘enough’ look like for you—one sentence, no explanation?",
          "What boundary or request would protect your self-respect without trying to control the other person?",
          "Next time, paste the exact words that stung and what you did right after.",
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
      "Option A: Write one sentence: “What I did, what I hoped it meant, and what I needed back.” Option B: Copy only the key paragraph and generate again for sharper focus.",
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
You are Havenly — a Wise Reflective Mirror.

VOICE:
Write directly to "you". Never say "the user" or "this person".

NON-NEGOTIABLE TRUTH RULE:
- NEVER invent events that did not appear in the entry.
- You MUST reference at least ONE specific moment or situation that appears in the entry.
- You may paraphrase specifics (recommended) or quote a short phrase from the entry.
- Avoid generic summaries when the entry contains concrete events.

TONE:
Grounded, calm, perceptive.
Not clinical. Not preachy. Not flattering.

GOAL:
Create self-understanding that turns into certainty, confidence, and gentle action.

PREMIUM PERCEPTION MULTIPLIER (IMPORTANT):
Make the reflection feel like it gives clarity, not just comfort.
Do this WITHOUT changing the schema by embedding short labeled lines INSIDE the existing fields.

Required internal structure:
- summary MUST include these labeled lines (as plain text, not markdown):
  1) "What you’re carrying:"
  2) "What’s really happening:"
  3) (PREMIUM only) "Deeper direction:"

- core_pattern: ONE sentence naming the deeper dynamic.

- gentle_next_step:
  MUST include:
  "Option A:" and "Option B:"
  (PREMIUM only) Add:
  "Script line:" (1–2 sentences, calm, non-pushy)

- questions: 2–4.
  The LAST question MUST start with: "Next time,"

OUTPUT RULES (STRICT):
Return valid JSON ONLY.
Use DOUBLE QUOTES for all JSON strings.
No markdown, no code fences, no extra text.

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

Create a Havenly Wise Mirror reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1050 : 650;

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
    // Attempt #1 (normal)
    const raw1 = await callGroq({
      temperature: input.plan === "PREMIUM" ? 0.55 : 0.4,
      system: systemBase,
    });

    const parsed1 = parseModelJson<any>(raw1);
    if (parsed1) return normalizeReflection(parsed1);

    // Attempt #2 (auto-retry: stricter, lower creativity => higher JSON compliance)
    const systemRetry = `
${systemBase}

RETRY:
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

    // Final fallback (premium-safe language, not “failure” language)
    return normalizeReflection({
      summary:
        input.plan === "PREMIUM"
          ? "What you’re carrying: Something important that doesn’t feel fully seen yet.\nWhat’s really happening: The meaning of your effort isn’t landing the way you intend.\nDeeper direction: You’re being pulled toward clearer needs and cleaner boundaries."
          : "What you’re carrying: Something important that doesn’t feel fully seen yet.\nWhat’s really happening: The meaning of your effort isn’t landing the way you intend.",
      core_pattern:
        "You’re trying to be understood through effort, but you need clearer agreement on what effort means.",
      themes: ["clarity", "needs", "expectations"],
      emotions: ["confusion", "frustration", "hurt"],
      gentle_next_step:
        input.plan === "PREMIUM"
          ? "Option A: Write one sentence: “When I do X, I hope it means Y to you.” Option B: Write one sentence: “What does effort look like to you, specifically?” Script line: “I care about you, and I keep trying—can we define what ‘effort’ means to you so I stop guessing?”"
          : "Option A: Write one sentence: “When I do X, I hope it means Y to you.” Option B: Ask yourself: “What do I need to feel appreciated?”",
      questions: [
        "What do you most want your effort to communicate—love, safety, commitment, respect?",
        "What is your ‘minimum standard’ for appreciation in a relationship?",
        "What would you stop doing if you were fully protecting your self-respect?",
        "Next time, paste the exact sentence that stung and what you felt in your body right after.",
      ],
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return normalizeReflection({
        summary:
          input.plan === "PREMIUM"
            ? "What you’re carrying: A situation that needs a more precise pass.\nWhat’s really happening: The reflection timed out before it could land cleanly.\nDeeper direction: You’re moving toward clarity and simplicity."
            : "What you’re carrying: A situation that needs a more precise pass.\nWhat’s really happening: The reflection timed out before it could land cleanly.",
        core_pattern:
          "This needs a calmer, more focused pass to turn emotion into clarity.",
        themes: ["clarity", "focus"],
        emotions: ["overwhelm"],
        gentle_next_step:
          input.plan === "PREMIUM"
            ? "Option A: Tap generate again. Option B: Shorten your entry to the key moment (6–10 lines). Script line: “I want us to be clear about what we each need, so we don’t keep missing each other.”"
            : "Option A: Tap generate again. Option B: Shorten your entry to the key moment (6–10 lines).",
        questions: [
          "What is the one question you want answered in plain words?",
          "What outcome would make you feel steady again?",
          "What are you afraid might be true here?",
          "Next time, paste only the key paragraph and the exact question you want answered.",
        ],
      });
    }

    return normalizeReflection({
      summary:
        input.plan === "PREMIUM"
          ? "What you’re carrying: Something that deserves clarity.\nWhat’s really happening: A temporary system issue blocked a clean reflection.\nDeeper direction: You’re moving toward naming your needs more directly."
          : "What you’re carrying: Something that deserves clarity.\nWhat’s really happening: A temporary system issue blocked a clean reflection.",
      core_pattern:
        "A clean reflection wasn’t available on this pass, but the pattern is still worth naming.",
      themes: ["clarity"],
      emotions: ["uncertainty"],
      gentle_next_step:
        input.plan === "PREMIUM"
          ? "Option A: Tap generate again. Option B: Retry after 30 seconds. Script line: “I want to talk about what appreciation looks like for us—specifically.”"
          : "Option A: Tap generate again. Option B: Retry after 30 seconds.",
      questions: [
        "What part of this feels most personal to you?",
        "What do you wish the other person understood about your intention?",
        "What would ‘enough’ look like in one sentence?",
        "Next time, capture the exact words that triggered you and what you did right after.",
      ],
    });
  } finally {
    clearTimeout(timeout);
  }
}
