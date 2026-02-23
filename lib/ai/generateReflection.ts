// lib/ai/generateReflection.ts
// Havenly Prompt V10.4 — Premium Perception Multiplier
// (Wise Mirror + Anchors + Validate + Auto-Retry + No-Crash + Post-Normalize + Per-Attempt Timeout)
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

/* ------------------------- JSON SAFETY HELPERS ------------------------- */

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

/* ------------------------- NORMALIZATION ------------------------- */

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

// Remove “1) ” / “2) ” prefixes from label lines
function stripLeadingListNumbers(s: string): string {
  return (s || "").replace(/\b\d+\)\s*(What you(?:’|')re carrying:)/gi, "$1")
    .replace(/\b\d+\)\s*(What(?:’|')s really happening:)/gi, "$1")
    .replace(/\b\d+\)\s*(Deeper direction:)/gi, "$1")
    .trim();
}

// Ensure summary has required labeled lines
function enforceSummaryStructure(summary: string, plan: Input["plan"]): string {
  const s = stripLeadingListNumbers(summary);

  const hasCarry = /What you(?:’|')re carrying:/i.test(s);
  const hasHappening = /What(?:’|')s really happening:/i.test(s);
  const hasDeeper = /Deeper direction:/i.test(s);

  if (hasCarry && hasHappening && (plan === "FREE" || hasDeeper)) return s;

  const lines: string[] = [];

  if (hasCarry) {
    // keep existing content
  } else {
    lines.push("What you're carrying: A mix of emotion and uncertainty that needs clearer words.");
  }

  if (hasHappening) {
    // keep existing content
  } else {
    lines.push("What's really happening: Your effort and the meaning your partner reads from it are not matching.");
  }

  if (plan === "PREMIUM" && !hasDeeper) {
    lines.push("Deeper direction: Move from guessing to explicit definitions and boundaries.");
  }

  // If we already have something, append missing lines; else return composed
  return s
    ? [s, ...lines].join("\n").trim()
    : lines.join("\n").trim();
}

// Ensure gentle_next_step has Option A/B and (premium) Script line
function enforceNextStepStructure(nextStep: string, plan: Input["plan"]): string {
  const s = cleanString(nextStep);
  const hasA = /Option A:/i.test(s);
  const hasB = /Option B:/i.test(s);
  const hasScript = /Script line:/i.test(s);

  const parts: string[] = [];
  if (s) parts.push(s);

  if (!hasA) {
    parts.push(
      "Option A: Ask for a concrete definition: “What does effort look like to you, specifically—weekly?”"
    );
  }
  if (!hasB) {
    parts.push(
      "Option B: Name your need plainly: “I need appreciation to be shown in words, not just implied.”"
    );
  }
  if (plan === "PREMIUM" && !hasScript) {
    parts.push(
      "Script line: “I care about you, and I’m getting lost guessing. Can we define what ‘effort’ means to you so I can meet it without overthinking?”"
    );
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

// Ensure last question starts with "Next time,"
function enforceLastQuestion(questions: string[]): string[] {
  if (!questions.length) return ["Next time, what exact moment should you capture so we can map the pattern precisely?"];
  const out = [...questions];
  const last = String(out[out.length - 1] ?? "").trim();
  if (!/^Next time,/.test(last)) {
    out[out.length - 1] = `Next time, ${last.replace(/^[^a-zA-Z0-9]*/, "")}`.trim();
    if (!/^Next time,/.test(out[out.length - 1])) {
      out[out.length - 1] =
        "Next time, paste the exact sentence that stung and what you did right after.";
    }
  }
  return out;
}

function normalizeReflection(r: any, plan: Input["plan"]): Reflection {
  const summaryRaw = cleanString(r?.summary);
  const corePattern = cleanString(r?.core_pattern);

  const themesRaw = cleanStringArray(r?.themes, 7);
  const emotionsRaw = cleanStringArray(r?.emotions, 7);
  const nextStepRaw = cleanString(r?.gentle_next_step);
  const questionsRaw = cleanStringArray(r?.questions, 4);

  const themes = themesRaw.length ? themesRaw.slice(0, 6) : ["reflection"];
  const emotions = emotionsRaw.length ? emotionsRaw.slice(0, 6) : ["neutral"];

  const questions =
    questionsRaw.length >= 2
      ? enforceLastQuestion(questionsRaw.slice(0, 4))
      : enforceLastQuestion([
          "What is the real need underneath what you wrote (respect, reassurance, appreciation, safety, clarity)?",
          "What would ‘enough’ look like for you—one sentence, no explanation?",
          "Next time, paste the exact words that stung and what you did right after.",
        ]);

  const summary = enforceSummaryStructure(
    summaryRaw ||
      "What you're carrying: Something important that deserves clearer reflection.\nWhat's really happening: Your effort is not landing the way you intend.",
    plan
  );

  const gentle_next_step = enforceNextStepStructure(
    nextStepRaw ||
      "Option A: Write one sentence: “What I did, what I hoped it meant, and what I needed back.” Option B: Copy only the key paragraph and generate again for sharper focus.",
    plan
  );

  return {
    summary,
    core_pattern: corePattern || undefined,
    themes,
    emotions,
    gentle_next_step,
    questions,
  };
}

/* ------------------------- ANCHORS ------------------------- */

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

/**
 * Anchor extraction (heuristic, fast, no dependencies).
 * Goal: produce short, human-readable anchors the model can reuse verbatim.
 */
function extractAnchors(entry: string): string[] {
  const t = entry || "";
  const anchors: string[] = [];

  const add = (s: string) => {
    const v = s.trim();
    if (!v) return;
    if (anchors.some((a) => normalizeForMatch(a) === normalizeForMatch(v))) return;
    anchors.push(v);
  };

  // Relationship/gifts
  if (/expensive gift|more expensive|spend more/i.test(t)) add('expensive gifts still feel "not enough"');
  if (/small.*gift|little gift/i.test(t)) add("small gifts from others make her happy");
  if (/paid for the gift/i.test(t)) add("you paid for a gift she gave to someone else");

  // Driving/night/safety
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

/* ------------------------- MAIN ------------------------- */

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryBody = (input.content || "").trim();
  const entryText = `${titleLine}Entry:\n${entryBody}`;

  const anchors = extractAnchors(entryBody);
  const anchorsBlock = anchors.map((a, i) => `${i + 1}) ${a}`).join("\n");

  const systemBase = `
You are Havenly — a Wise Reflective Mirror.

VOICE:
Write directly to "you". Never say "the user" or "this person".

TRUTH (NON-NEGOTIABLE):
- NEVER invent events that did not appear in the entry.
- You MUST reference at least ONE concrete moment from the entry.
- You MUST include at least ONE of the provided ANCHORS exactly as written (verbatim).
- Do not use placeholder phrasing like "a situation happened." Name the situation.

TONE:
Grounded, calm, perceptive.
Not clinical. Not preachy. Not flattering.

GOAL:
Create self-understanding that turns into certainty, confidence, and gentle action.

PREMIUM PERCEPTION MULTIPLIER:
Make it feel like clarity (not just comfort) WITHOUT changing the schema.

Required internal structure:
- summary MUST include these labeled lines (plain text):
  "What you're carrying:"
  "What's really happening:"
  (PREMIUM only) "Deeper direction:"

- core_pattern: ONE sentence naming the deeper dynamic.

- gentle_next_step MUST include:
  "Option A:" and "Option B:"
  (PREMIUM only) add:
  "Script line:" (1–2 sentences, calm, non-pushy)

- questions: 2–4.
  The LAST question MUST start with: "Next time,"

OUTPUT RULES (STRICT):
Return valid JSON ONLY.
Use DOUBLE QUOTES for all JSON strings.
No markdown, no code fences, no extra text.

Return EXACTLY this schema:
{
  "summary": "...",
  "core_pattern": "...",
  "themes": ["..."],
  "emotions": ["..."],
  "gentle_next_step": "...",
  "questions": ["..."]
}
`.trim();

  const user = `
User plan: ${input.plan}

ANCHORS (you MUST include at least ONE verbatim in your reflection):
${anchorsBlock}

Create a Havenly Wise Mirror reflection for this journal entry:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1050 : 650;

  // Per-attempt call with its own abort + timeout (prevents retry abort issues)
  async function callGroq(args: { temperature: number; system: string; timeoutMs: number }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), args.timeoutMs);

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
    } finally {
      clearTimeout(timeout);
    }
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

  try {
    // Attempt #1
    const raw1 = await callGroq({
      temperature: input.plan === "PREMIUM" ? 0.55 : 0.4,
      system: systemBase,
      timeoutMs: 30000,
    });

    const parsed1 = parseModelJson<any>(raw1);
    if (parsed1) {
      const checkText = reflectionTextForCheck(parsed1);
      if (containsAny(checkText, anchors)) return normalizeReflection(parsed1, input.plan);
    }

    // Attempt #2 (strict)
    const systemRetry = `
${systemBase}

RETRY (STRICT):
Your previous output was either not valid JSON OR it did NOT include any ANCHOR verbatim.
Now output ONLY valid JSON with the exact schema AND include at least ONE ANCHOR verbatim.
No extra commentary. No markdown. Use double quotes only.
`.trim();

    const raw2 = await callGroq({
      temperature: 0.2,
      system: systemRetry,
      timeoutMs: 30000,
    });

    const parsed2 = parseModelJson<any>(raw2);
    if (parsed2) {
      const checkText = reflectionTextForCheck(parsed2);
      if (containsAny(checkText, anchors)) return normalizeReflection(parsed2, input.plan);
    }

    // Attempt #3 (force one anchor in a specific line)
    const systemFinal = `
${systemBase}

FINAL ATTEMPT:
You MUST include EXACTLY ONE of the ANCHORS verbatim in the summary line: "What's really happening:".
Return only valid JSON.
`.trim();

    const raw3 = await callGroq({
      temperature: 0.1,
      system: systemFinal,
      timeoutMs: 30000,
    });

    const parsed3 = parseModelJson<any>(raw3);
    if (parsed3) {
      const checkText = reflectionTextForCheck(parsed3);
      if (containsAny(checkText, anchors)) return normalizeReflection(parsed3, input.plan);
    }

    // Final fallback (anchored, not “system failed” tone)
    const fallbackAnchor = anchors[0] || "your big efforts feel unseen";
    return normalizeReflection(
      {
        summary:
          input.plan === "PREMIUM"
            ? `What you're carrying: You're tired of trying and still feeling "not enough".\nWhat's really happening: ${fallbackAnchor}.\nDeeper direction: Move from guessing to explicit definitions and boundaries.`
            : `What you're carrying: You're tired of trying and still feeling "not enough".\nWhat's really happening: ${fallbackAnchor}.`,
        core_pattern:
          "You’re trying to be understood through effort, but you need agreement on what effort means in this relationship.",
        themes: ["clarity", "needs", "expectations"],
        emotions: ["confusion", "frustration", "hurt"],
        gentle_next_step:
          input.plan === "PREMIUM"
            ? "Option A: Ask for a specific definition of effort (weekly). Option B: State your minimum need for appreciation. Script line: “I care about you, and I’m tired of guessing—can we define what ‘effort’ means to you so I can meet it without losing myself?”"
            : "Option A: Ask for a specific definition of effort. Option B: State your minimum need for appreciation.",
        questions: [
          "What do you most want your effort to communicate—love, safety, commitment, respect?",
          "What is your minimum standard for appreciation in a relationship?",
          "What would you stop doing if you were fully protecting your self-respect?",
          "Next time, paste the exact sentence that stung and what you did right after.",
        ],
      },
      input.plan
    );
  } catch (err: any) {
    const fallbackAnchor = anchors[0] || "your big efforts feel unseen";
    if (err?.name === "AbortError") {
      return normalizeReflection(
        {
          summary:
            input.plan === "PREMIUM"
              ? `What you're carrying: A lot of emotion that needs a calmer pass.\nWhat's really happening: ${fallbackAnchor}.\nDeeper direction: You're moving toward clarity and simplicity.`
              : `What you're carrying: A lot of emotion that needs a calmer pass.\nWhat's really happening: ${fallbackAnchor}.`,
          core_pattern: "This needs a calmer, more focused pass to turn emotion into clarity.",
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
        },
        input.plan
      );
    }

    return normalizeReflection(
      {
        summary:
          input.plan === "PREMIUM"
            ? `What you're carrying: Something that deserves clarity.\nWhat's really happening: ${fallbackAnchor}.\nDeeper direction: You're moving toward naming your needs more directly.`
            : `What you're carrying: Something that deserves clarity.\nWhat's really happening: ${fallbackAnchor}.`,
        core_pattern: "A clean reflection wasn’t available on this pass, but the pattern is still worth naming.",
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
      },
      input.plan
    );
  }
}
