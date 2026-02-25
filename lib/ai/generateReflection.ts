// lib/ai/generateReflection.ts
// Havenly V11.3 — Strong FREE Baseline (Entry-Derived Anchors + Quality Gate + Auto-Retry + Safe Memory)
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
  const cleaned = qs.map((s) => String(s || "").trim()).filter(Boolean);

  // Generic defaults (works for work, relationships, health, goals, etc.)
  const defaults = [
    "What exactly did the moment trigger in you—embarrassment, anger, shame, fear, or something else?",
    "What is the cleanest interpretation that still respects your feelings?",
    "What boundary or request would protect you without escalating the situation?",
    "Next time, paste the exact words that stung and what you did immediately after.",
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
    themes: themes.length ? themes : ["clarity", "communication", "self-respect"],
    emotions: emotions.length ? emotions : ["confusion", "frustration", "hurt"],
    gentle_next_step:
      nextStep ||
      "Option A: Name the moment in one sentence. Option B: Ask one clean question to clarify what you need next.",
    questions: ensureFourQuestions(questionsRaw),
  };
}

/**
 * Anchor extraction (heuristic, fast).
 * Priority:
 * 1) QUOTED PHRASES (highest signal)
 * 2) 1–2 SENTENCES FROM THIS ENTRY (verbatim)
 * 3) CONTEXT CLUES (work/relationship/health/etc.)
 * 4) NEUTRAL FALLBACKS ONLY (never relationship-biased)
 */
function extractAnchors(entry: string): string[] {
  const t = (entry || "").trim();
  const anchors: string[] = [];

  const add = (s: string) => {
    const v = String(s || "").trim();
    if (!v) return;
    if (anchors.some((a) => normalizeForMatch(a) === normalizeForMatch(v))) return;
    anchors.push(v);
  };

  // 1) Pull quoted phrases as high-signal anchors: “...” or "..."
  const quoteMatches = t.match(/[“"][^”"]+[”"]/g) || [];
  for (const q of quoteMatches) {
    const cleaned = q.replace(/^[“"]|[”"]$/g, "").trim();
    if (cleaned.length >= 4 && cleaned.length <= 90) add(`“${cleaned}”`);
    if (anchors.length >= 3) break;
  }

  // 2) Take up to 2 short sentences from THIS entry (verbatim, not invented)
  if (anchors.length < 2) {
    const sentences = t
      .split(/\n|[.!?]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);

    for (const s of sentences) {
      const short = s.length > 110 ? s.slice(0, 110).trim() : s;
      add(short);
      if (anchors.length >= 2) break;
    }
  }

  // 3) Context clue anchors (broad, not domain-specific)
  if (/in front of others|in front of people|public|everyone/i.test(t)) {
    add("in front of others");
  }
  if (/colleague|coworker|manager|team|meeting|work/i.test(t)) {
    add("a work moment landed as a put-down");
  }
  if (/smiled|laughed it off|kept it in|stayed silent/i.test(t)) {
    add("you smiled in the moment, then replayed it later");
  }
  if (/replaying|kept replaying|ruminat/i.test(t)) {
    add("you kept replaying it and felt small");
  }
  if (/respond without starting a fight|don’t want to start a fight|avoid conflict/i.test(t)) {
    add("you want to respond without starting a fight");
  }

  // 4) Domain-specific anchors only if clearly present (do NOT force)
  // Relationship / gifts mismatch (only if entry actually indicates it)
  if (/expensive gift|more expensive|spend more/i.test(t)) add("expensive gifts still feel “not enough”");
  if (/small.*gift|little gift/i.test(t)) add("small gifts from others make her happy");
  if (/paid for the gift/i.test(t)) add("you paid for a gift she gave to someone else");

  // Driving / safety (only if present)
  if (/night/i.test(t) && /road|roads/i.test(t)) add("driving at night when the roads were bad");
  if (/weather/i.test(t)) add("bad weather while trying to get her home safely");
  if (/worried about.*driving/i.test(t)) add("she worried about your driving more than your intention");
  if (/taxi/i.test(t)) add("you planned to take a taxi back after dropping her off");
  if (/mom|mother/i.test(t)) add("leaving the car at her mom’s place");

  // Neutral fallbacks ONLY (never “partner”)
  if (anchors.length < 2) {
    add("a moment felt dismissive");
    add("you don’t want to stay silent again");
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

  // FREE entries can be short; avoid over-rejecting good concise output
  const minSummaryLen = plan === "PREMIUM" ? 240 : 150;
  if (summary.length < minSummaryLen) return false;

  // Variety (FREE can be 2; PREMIUM should be richer)
  if (plan === "PREMIUM") {
    if (themes.length < 3) return false;
    if (emotions.length < 3) return false;
  } else {
    if (themes.length < 2) return false;
    if (emotions.length < 2) return false;
  }

  // Must have some questions
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

  const recentThemes = (input.recentThemes || [])
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 5);

  const memoryBlock = recentThemes.length
    ? `RECENT THEMES FROM THIS USER (optional context, do NOT overreach):\n${recentThemes
        .map((t, i) => `${i + 1}) ${t}`)
        .join("\n")}`
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
- Keep it specific to THIS entry (no other life area).
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

    // Strong fallback (still anchored + concrete, and neutral)
    const a1 = anchors[0] || "a moment felt dismissive";
    const a2 = anchors[1] || "you don’t want to stay silent again";
    const continuityLine = recentThemes.length
      ? `This echoes a theme you’ve touched before: ${recentThemes[0]}.`
      : "";

    return normalizeReflection({
      summary:
        input.plan === "PREMIUM"
          ? `What you’re carrying: You’re holding a mix of emotion that’s asking for clean self-respect.\nWhat’s really happening: ${a1} — and it’s pulling you between keeping the peace and speaking up.\nDeeper direction: You’re moving toward clearer boundaries and calmer communication.\n${continuityLine}`.trim()
          : `What you’re carrying: You’re holding a mix of emotion that’s asking for clean self-respect.\nWhat’s really happening: ${a1} — and it’s pulling you between keeping the peace and speaking up.\n${continuityLine}`.trim(),
      core_pattern:
        "You’re trying to protect harmony, but you also need a respectful way to name what crossed a line.",
      themes: ["communication", "self-respect", "boundaries", "confidence"],
      emotions: ["irritation", "hurt", "embarrassment", "uncertainty"],
      gentle_next_step:
        input.plan === "PREMIUM"
          ? "Option A: Name the impact in one sentence and stop there. Option B: Ask for a better way to handle it next time. Script line: “When you said that, I felt put on the spot—can we keep feedback private and specific?”"
          : "Option A: Name the impact in one sentence and stop there. Option B: Ask for a better way to handle it next time.",
      questions: [
        "What part of the moment felt worst—being judged, being exposed, or feeling dismissed?",
        "What would a calm, one-sentence response sound like if you were protecting your dignity?",
        "What boundary would help you speak up without turning it into a fight?",
        "Next time, paste the exact words that stung and what you did immediately after.",
      ],
    });
  } catch (err: any) {
    const a1 = anchors[0] || "a moment felt dismissive";
    const a2 = anchors[1] || "you don’t want to stay silent again";

    return normalizeReflection({
      summary: `What you’re carrying: Something important needs a cleaner pass.\nWhat’s really happening: ${a1} — and it’s pulling you between keeping the peace and speaking up.`.trim(),
      core_pattern:
        "This needs a calmer, more focused pass to turn emotion into a clear next move.",
      themes: ["clarity", "communication", "self-respect"],
      emotions: ["uncertainty", "frustration", "overwhelm"],
      gentle_next_step:
        "Option A: Tap generate again. Option B: Shorten the entry to the key moment (6–10 lines) and try again.",
      questions: [
        "What is the one outcome you want from speaking up—apology, respect, or a new boundary?",
        "What would you say in one sentence if you were calm and firm?",
        "What are you afraid will happen if you speak up?",
        "Next time, paste only the key paragraph and the exact question you want answered.",
      ],
    });
  } finally {
    clearTimeout(timeout);
  }
}
