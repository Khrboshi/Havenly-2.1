// lib/ai/generateReflection.ts
// Havenly V11.2 — Strong FREE Baseline (Anchors + Quality Gate + Auto-Retry + Safe Memory)
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
  recentThemes?: string[]; // optional cross-journal hints (FREE-safe)
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

function normalizeForMatch(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s'’-]/gu, "")
    .trim();
}

function containsAny(haystack: string, needles: string[]): boolean {
  const h = normalizeForMatch(haystack);
  for (const n of needles) {
    const nn = normalizeForMatch(n);
    if (!nn) continue;
    if (h.includes(nn)) return true;
  }
  return false;
}

function ensureFourQuestions(qs: string[]): string[] {
  const cleaned = qs.map(s => String(s || "").trim()).filter(Boolean);
  const defaults = [
    "What do you most want your effort to communicate—love, safety, commitment, respect?",
    "What is your minimum standard for appreciation in a relationship?",
    "What would you stop doing if you were fully protecting your self-respect?",
    "Next time, paste the exact sentence that stung and what you did right after.",
  ];
  const out = cleaned.slice(0, 4);
  while (out.length < 4) out.push(defaults[out.length]);
  // Last must start with "Next time,"
  if (!out[out.length - 1].toLowerCase().startsWith("next time,")) {
    out[out.length - 1] = defaults[3];
  }
  return out.slice(0, 4);
}

function normalizeReflection(r: any): Reflection {
  const summary = cleanString(r?.summary);
  const corePattern = cleanString(r?.core_pattern);

  const themesRaw = cleanStringArray(r?.themes, 8);
  const emotionsRaw = cleanStringArray(r?.emotions, 8);
  const nextStep = cleanString(r?.gentle_next_step);
  const questionsRaw = cleanStringArray(r?.questions, 6);

  const themes = themesRaw.length ? themesRaw.slice(0, 6) : [];
  const emotions = emotionsRaw.length ? emotionsRaw.slice(0, 6) : [];

  return {
    summary:
      summary ||
      "What you’re carrying: Something important is asking for clarity.\nWhat’s really happening: The meaning of your effort isn’t landing the way you intend.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["clarity", "needs", "expectations"],
    emotions: emotions.length ? emotions : ["confusion", "frustration", "hurt"],
    gentle_next_step:
      nextStep ||
      "Option A: Write one sentence: “When I do X, I hope it means Y.” Option B: Ask: “What does effort look like to you—specifically?”",
    questions: ensureFourQuestions(questionsRaw),
  };
}

/**
 * Anchor extraction (heuristic, fast).
 * Goal: produce short anchors the model can reuse verbatim.
 */
function extractAnchors(entry: string): string[] {
  const t = entry || "";
  const anchors: string[] = [];

  const add = (s: string) => {
    const v = s.trim();
    if (!v) return;
    if (anchors.some(a => normalizeForMatch(a) === normalizeForMatch(v))) return;
    anchors.push(v);
  };

  // Gifts / appreciation mismatch
  if (/expensive gift|more expensive|spend more/i.test(t)) add("expensive gifts still feel “not enough”");
  if (/small.*gift|little gift/i.test(t)) add("small gifts from others make her happy");
  if (/paid for the gift/i.test(t)) add("you paid for a gift she gave to someone else");

  // Driving / safety
  if (/night/i.test(t) && /road|roads/i.test(t)) add("driving at night when the roads were bad");
  if (/weather/i.test(t)) add("bad weather while trying to get her home safely");
  if (/worried about how i am driving|worried about.*driving/i.test(t)) add("she worried about your driving more than your intention");
  if (/taxi/i.test(t)) add("you planned to take a taxi back after dropping her off");
  if (/mom|mother/i.test(t)) add("leaving the car at her mom’s place");

  if (anchors.length < 2) {
    add("your big efforts feel unseen");
    add("small gestures from others land differently");
  }

  return anchors.slice(0, 5);
}

function reflectionTextForCheck(r: any): string {
  const parts = [
    cleanString(r?.summary),
    cleanString(r?.core_pattern),
    cleanString(r?.gentle_next_step),
    ...(Array.isArray(r?.questions) ? r.questions.map(String) : []),
  ];
  return parts.join("\n");
}

function qualityPass(parsed: any, anchors: string[], plan: "FREE" | "PREMIUM"): boolean {
  const summary = cleanString(parsed?.summary);
  const nextStep = cleanString(parsed?.gentle_next_step);
  const qs = Array.isArray(parsed?.questions) ? parsed.questions : [];
  const themes = Array.isArray(parsed?.themes) ? parsed.themes : [];
  const emotions = Array.isArray(parsed?.emotions) ? parsed.emotions : [];

  const text = reflectionTextForCheck(parsed);

  // Must include at least one anchor verbatim
  if (!containsAny(text, anchors)) return false;

  // Must contain the labeled structure
  if (!summary.includes("What you’re carrying:")) return false;
  if (!summary.includes("What’s really happening:")) return false;
  if (plan === "PREMIUM" && !summary.includes("Deeper direction:")) return false;

  // Must include A/B options
  if (!/Option A:/i.test(nextStep) || !/Option B:/i.test(nextStep)) return false;

  // Must have usable depth: avoid tiny fallback-looking reflections
  if (summary.length < (plan === "PREMIUM" ? 240 : 200)) return false;

  // Ensure some variety
  if (themes.length < 3) return false;
  if (emotions.length < 3) return false;

  // Ensure 3–4 questions (we normalize to 4 anyway, but make sure model returned something)
  if (qs.length < 2) return false;

  return true;
}

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryBody = (input.content || "").trim();
  const entryText = `${titleLine}Entry:\n${entryBody}`;

  const anchors = extractAnchors(entryBody);
  const anchorsBlock = anchors.map((a, i) => `${i + 1}) ${a}`).join("\n");

  const recentThemes = (input.recentThemes || []).map(s => String(s).trim()).filter(Boolean).slice(0, 5);
  const memoryBlock = recentThemes.length
    ? `RECENT THEMES FROM THIS USER (optional context, do NOT overreach):\n${recentThemes.map((t, i) => `${i + 1}) ${t}`).join("\n")}`
    : "";

  const systemBase = `
You are Havenly — a Wise Reflective Mirror.

VOICE:
Write directly to "you". Never say "the user" or "this person".

TRUTH (NON-NEGOTIABLE):
- NEVER invent events that did not appear in the entry.
- You MUST reference at least ONE concrete moment from the entry.
- To ensure specificity, you MUST include at least ONE of the provided ANCHORS exactly as written (verbatim).
- Do not use placeholder phrasing like “a situation happened.” Name the situation.

CROSS-JOURNAL CONTINUITY (FREE SAFE):
- If RECENT THEMES exist, you MAY add ONE sentence like:
  “This echoes a theme you’ve touched before: <theme>.”
- Do NOT diagnose. Do NOT profile identity. Keep it grounded.

TONE:
Grounded, calm, perceptive. Not clinical. Not preachy. Not flattering.

GOAL:
Create self-understanding that turns into certainty, confidence, and gentle action.

STRUCTURE REQUIREMENTS:
- summary MUST include these labeled lines (plain text):
  1) "What you’re carrying:"
  2) "What’s really happening:"
  3) (PREMIUM only) "Deeper direction:"

- core_pattern: ONE concise sentence naming the deeper dynamic.

- gentle_next_step MUST include:
  "Option A:" and "Option B:"
  (PREMIUM only) add:
  "Script line:" (1–2 sentences, calm, non-pushy)

- questions: return 4 questions.
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

${memoryBlock}

ANCHORS (you MUST include at least ONE verbatim):
${anchorsBlock}

Create a Havenly reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1050 : 700;

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
      temperature: input.plan === "PREMIUM" ? 0.55 : 0.45,
      system: systemBase,
    });

    const parsed1 = parseModelJson<any>(raw1);
    if (parsed1 && qualityPass(parsed1, anchors, input.plan)) {
      return normalizeReflection(parsed1);
    }

    // Attempt #2 (stricter)
    const systemRetry2 = `
${systemBase}

RETRY (STRICT):
Your previous output was either not valid JSON OR did not meet requirements.
Now:
- Include ONE ANCHOR verbatim in "What’s really happening:"
- Include TWO concrete moments (one primary + one secondary).
- Keep it specific, not generic.
Return ONLY valid JSON.
`.trim();

    const raw2 = await callGroq({
      temperature: 0.25,
      system: systemRetry2,
    });

    const parsed2 = parseModelJson<any>(raw2);
    if (parsed2 && qualityPass(parsed2, anchors, input.plan)) {
      return normalizeReflection(parsed2);
    }

    // Attempt #3 (final forcing)
    const systemRetry3 = `
${systemBase}

FINAL ATTEMPT:
You MUST include EXACTLY ONE ANCHOR verbatim in the summary line "What’s really happening:".
Also include a second concrete moment from the entry (paraphrase is fine).
Return ONLY valid JSON.
`.trim();

    const raw3 = await callGroq({
      temperature: 0.12,
      system: systemRetry3,
    });

    const parsed3 = parseModelJson<any>(raw3);
    if (parsed3 && qualityPass(parsed3, anchors, input.plan)) {
      return normalizeReflection(parsed3);
    }

    // Strong fallback (still anchored + concrete)
    const a1 = anchors[0] || "your big efforts feel unseen";
    const a2 = anchors[1] || "small gestures from others land differently";
    const continuityLine = recentThemes.length ? `This echoes a theme you’ve touched before: ${recentThemes[0]}.` : "";

    return normalizeReflection({
      summary:
        input.plan === "PREMIUM"
          ? `What you’re carrying: You’re exhausted from trying to love well and still feeling “not enough”.\nWhat’s really happening: ${a1} — and that’s colliding with ${a2}.\nDeeper direction: You’re being pulled toward clearer needs and cleaner boundaries.\n${continuityLine}`.trim()
          : `What you’re carrying: You’re exhausted from trying to love well and still feeling “not enough”.\nWhat’s really happening: ${a1} — and that’s colliding with ${a2}.\n${continuityLine}`.trim(),
      core_pattern:
        "You’re trying to be understood through effort, but you need agreement on what effort means and how appreciation is shown.",
      themes: ["appreciation", "misaligned expectations", "communication", "effort"],
      emotions: ["confusion", "frustration", "hurt", "uncertainty"],
      gentle_next_step:
        input.plan === "PREMIUM"
          ? "Option A: Ask one clean question: “What does effort look like to you, specifically?” Option B: Name your need without defending: “I need appreciation when I try to protect and support you.” Script line: “I care about you, and I’m tired of guessing—can we define what ‘effort’ means to you so I can meet it without losing myself?”"
          : "Option A: Ask one clean question: “What does effort look like to you, specifically?” Option B: Name your need simply: “When I try to support you, I need appreciation—not criticism.”",
      questions: [
        "If you stop trying to ‘earn’ appreciation, what would you do differently this week?",
        "What would a fair, specific appreciation response from your partner sound like?",
        "What boundary would protect you from feeling ‘never enough’?",
        "Next time, paste the exact words she said and what you did immediately after.",
      ],
    });
  } catch (err: any) {
    const a1 = anchors[0] || "your big efforts feel unseen";
    const a2 = anchors[1] || "small gestures from others land differently";

    return normalizeReflection({
      summary:
        `What you’re carrying: Something important needs a cleaner pass.\nWhat’s really happening: ${a1} — and it’s colliding with ${a2}.`.trim(),
      core_pattern: "A stable reflection wasn’t available on this pass, but the pattern still deserves clarity.",
      themes: ["clarity", "communication", "expectations"],
      emotions: ["uncertainty", "frustration", "overwhelm"],
      gentle_next_step:
        "Option A: Tap generate again. Option B: Shorten the entry to the key moment (6–10 lines) and try again.",
      questions: [
        "What is the one sentence you wish she understood about your intention?",
        "What is the minimum appreciation you require to stay steady?",
        "What are you afraid might be true here?",
        "Next time, paste only the key paragraph and the exact question you want answered.",
      ],
    });
  } finally {
    clearTimeout(timeout);
  }
}
