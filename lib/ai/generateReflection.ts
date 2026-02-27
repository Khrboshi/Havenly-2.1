// lib/ai/generateReflection.ts
// Havenly V11.4 — Domain-Locked FREE Baseline (Entry-Derived Anchors + Domain Guardrails + Quality Gate + Auto-Retry + Safe Memory)

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
  recentThemes?: string[];
};

type Domain = "WORK" | "RELATIONSHIP" | "FITNESS" | "GENERAL";

/** Robust fitness signal: handles "ran", "5km", "5 km", "5k" */
function isFitnessText(s: string): boolean {
  const t = (s || "").toLowerCase();
  return (
    /\bran\b/.test(t) ||
    /\brun\b/.test(t) ||
    /\brunning\b/.test(t) ||
    /\bworkout\b/.test(t) ||
    /\btraining\b/.test(t) ||
    /\bexercise\b/.test(t) ||
    /\bgym\b/.test(t) ||
    /\blift\b/.test(t) ||
    /\blifting\b/.test(t) ||
    /\bcardio\b/.test(t) ||
    /\bpace\b/.test(t) ||
    /\bsteps?\b/.test(t) ||
    /\bsore\b/.test(t) ||
    /\brecovery\b/.test(t) ||
    /\brest\b/.test(t) ||
    /\bsleep\b/.test(t) ||
    /\bhydration\b/.test(t) ||
    /\b(\d+)\s*km\b/.test(t) ||
    /\b(\d+)\s*k\b/.test(t)
  );
}

function detectDomain(t: string): Domain {
  const s = (t || "").toLowerCase();

  const fitness = isFitnessText(s);

  const work =
    /colleague|coworker|manager|team|meeting|work|office|client|boss/.test(s);

  const rel =
    /partner|wife|husband|girlfriend|boyfriend|relationship|love|date|argue|fight|gift/.test(
      s
    );

  if (fitness && !work && !rel) return "FITNESS";
  if (work && !fitness && !rel) return "WORK";
  if (rel && !fitness && !work) return "RELATIONSHIP";
  return "GENERAL";
}

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

function ensureFourQuestions(qs: string[], domain: Domain): string[] {
  const cleaned = qs.map((s) => String(s || "").trim()).filter(Boolean);

  const defaultsGeneral = [
    "What exactly did the moment trigger in you—anger, shame, fear, sadness, or something else?",
    "What is the cleanest interpretation that still respects your feelings?",
    "What boundary or request would protect you without escalating the situation?",
    "Next time, paste the exact words that stung and what you did immediately after.",
  ];

  const defaultsFitness = [
    "What did you prove to yourself by showing up today?",
    "What would “healthy discipline” look like this week (not perfection)?",
    "What is one recovery signal your body gives you that you tend to ignore?",
    "Next time, paste your exact self-talk after the workout and what you did next.",
  ];

  const defaults = domain === "FITNESS" ? defaultsFitness : defaultsGeneral;

  const out = cleaned.slice(0, 4);
  while (out.length < 4) out.push(defaults[out.length]);

  if (!out[out.length - 1].toLowerCase().startsWith("next time,")) {
    out[out.length - 1] = defaults[3];
  }

  return out.slice(0, 4);
}

function normalizeReflection(r: any, domain: Domain): Reflection {
  const summary = cleanString(r?.summary);
  const corePattern = cleanString(r?.core_pattern);

  const themesRaw = cleanStringArray(r?.themes, 8);
  const emotionsRaw = cleanStringArray(r?.emotions, 8);
  const nextStep = cleanString(r?.gentle_next_step);
  const questionsRaw = cleanStringArray(r?.questions, 6);

  const themes = themesRaw.length ? themesRaw.slice(0, 6) : [];
  const emotions = emotionsRaw.length ? emotionsRaw.slice(0, 6) : [];

  const defaultSummaryFitness =
    "What you’re carrying: Pride mixed with fatigue — you did something hard and your body is asking for recovery.\nWhat’s really happening: You’re negotiating the line between healthy challenge and unnecessary pressure.";
  const defaultSummaryGeneral =
    "What you’re carrying: Something important is asking for clarity.\nWhat’s really happening: The meaning of what happened isn’t sitting right inside you yet.";

  const defaultNextFitness =
    "Option A: Choose one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow’s effort as “easy” or “hard” before you start.";
  const defaultNextGeneral =
    "Option A: Name the moment in one sentence. Option B: Ask one clean question to clarify what you need next.";

  return {
    summary:
      summary ||
      (domain === "FITNESS" ? defaultSummaryFitness : defaultSummaryGeneral),
    core_pattern: corePattern || undefined,
    themes:
      themes.length
        ? themes
        : domain === "FITNESS"
          ? ["consistency", "recovery", "self-respect"]
          : ["clarity", "communication", "self-respect"],
    emotions:
      emotions.length
        ? emotions
        : domain === "FITNESS"
          ? ["pride", "tiredness", "uncertainty"]
          : ["confusion", "frustration", "hurt"],
    gentle_next_step:
      nextStep || (domain === "FITNESS" ? defaultNextFitness : defaultNextGeneral),
    questions: ensureFourQuestions(questionsRaw, domain),
  };
}

function extractAnchors(entry: string): string[] {
  const t = (entry || "").trim();
  const anchors: string[] = [];

  const add = (s: string) => {
    const v = String(s || "").trim();
    if (!v) return;
    if (anchors.some((a) => normalizeForMatch(a) === normalizeForMatch(v))) return;
    anchors.push(v);
  };

  const quoteMatches = t.match(/[“"][^”"]+[”"]/g) || [];
  for (const q of quoteMatches) {
    const cleaned = q.replace(/^[“"]|[”"]$/g, "").trim();
    if (cleaned.length >= 4 && cleaned.length <= 90) add(`“${cleaned}”`);
    if (anchors.length >= 3) break;
  }

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

  if (/in front of others|in front of people|public|everyone/i.test(t)) add("in front of others");
  if (/colleague|coworker|manager|team|meeting|work/i.test(t)) add("a work moment landed as a put-down");
  if (/smiled|laughed it off|kept it in|stayed silent/i.test(t)) add("you smiled in the moment, then replayed it later");
  if (/replaying|kept replaying|ruminat/i.test(t)) add("you kept replaying it and felt small");
  if (/respond without starting a fight|don’t want to start a fight|avoid conflict/i.test(t))
    add("you want to respond without starting a fight");

  // Fitness anchors (robust)
  if (isFitnessText(t)) {
    if (/ran\s*5\s*km/i.test(t) || /ran\s*5km/i.test(t) || /ran\s*5\s*k\b/i.test(t) || /ran\s*5k\b/i.test(t)) {
      add("I ran 5km today and felt proud but also tired");
    } else {
      add("you exercised and felt proud but also tired");
    }
  }

  if (/tired|exhausted|fatigue/i.test(t)) add("part of you wants rest while another wants to push harder");
  if (/improving|progress|forcing myself|discipline/i.test(t)) add("you’re questioning whether this is growth or pressure");

  if (anchors.length < 2) {
    add("a moment felt important");
    add("you want clarity about what it means");
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

function qualityPass(
  parsed: any,
  anchors: string[],
  plan: "FREE" | "PREMIUM",
  domain: Domain
): boolean {
  const summary = cleanString(parsed?.summary);
  const nextStep = cleanString(parsed?.gentle_next_step);
  const qs = Array.isArray(parsed?.questions) ? parsed.questions : [];
  const themes = Array.isArray(parsed?.themes) ? parsed.themes : [];
  const emotions = Array.isArray(parsed?.emotions) ? parsed.emotions : [];

  const text = reflectionTextForCheck(parsed);
  const s = text.toLowerCase();

  // Must include at least one anchor verbatim-ish
  if (!containsAny(text, anchors)) return false;

  if (!summary.includes("What you’re carrying:")) return false;
  if (!summary.includes("What’s really happening:")) return false;
  if (plan === "PREMIUM" && !summary.includes("Deeper direction:")) return false;

  if (!/Option A:/i.test(nextStep) || !/Option B:/i.test(nextStep)) return false;

  const minSummaryLen = plan === "PREMIUM" ? 240 : 150;
  if (summary.length < minSummaryLen) return false;

  if (plan === "PREMIUM") {
    if (themes.length < 3) return false;
    if (emotions.length < 3) return false;
  } else {
    if (themes.length < 2) return false;
    if (emotions.length < 2) return false;
  }

  if (qs.length < 2) return false;

  // Domain lock (hard)
  if (domain === "FITNESS") {
    // 1) Must contain fitness signal
    const mustHave =
      /\b(ran|run|running|workout|training|exercise|recovery|rest|sleep|hydration|pace|cardio)\b|\b\d+\s*km\b|\b\d+\s*k\b/;
    if (!mustHave.test(s)) return false;

    // 2) Must not drift to work/relationship conflict
    const drift =
      /\b(colleague|coworker|manager|meeting|office|partner|wife|husband|girlfriend|boyfriend|relationship|argument|fight|speaking up|keep the peace)\b/;
    if (drift.test(s)) return false;
  }

  return true;
}

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryBody = (input.content || "").trim();
  const entryText = `${titleLine}Entry:\n${entryBody}`;

  const domain = detectDomain(entryBody);

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
- You MUST include at least ONE of the provided ANCHORS exactly as written (verbatim).
- Do not use placeholder phrasing like “a situation happened.” Name the situation.

DOMAIN GUARDRAIL (NON-NEGOTIABLE):
- Domain for this entry is: ${domain}
- You MUST stay inside this domain.
- If domain is FITNESS, do NOT talk about colleagues, partners, speaking up, conflict with others, or “keeping the peace”.
- If domain is WORK, do NOT talk about partners/relationship dynamics.
- If domain is RELATIONSHIP, do NOT talk about workplace dynamics unless explicitly present.
- Do not blend multiple life areas.

CROSS-JOURNAL CONTINUITY (FREE SAFE):
- If RECENT THEMES exist, you MAY add ONE sentence like:
  “This echoes a theme you’ve touched before: <theme>.”
- Do NOT diagnose. Do NOT profile identity. Keep it grounded.

TONE:
Grounded, calm, perceptive. Not clinical. Not preachy. Not flattering.

STRUCTURE REQUIREMENTS:
- summary MUST include these labeled lines (plain text):
  1) "What you’re carrying:"
  2) "What’s really happening:"
  3) (PREMIUM only) "Deeper direction:"

- core_pattern: ONE concise sentence naming the deeper dynamic.

- gentle_next_step MUST include:
  "Option A:" and "Option B:"
  (PREMIUM only) add "Script line:" (1–2 sentences, calm, non-pushy)

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
    const raw1 = await callGroq({
      temperature: input.plan === "PREMIUM" ? 0.55 : 0.45,
      system: systemBase,
    });

    const parsed1 = parseModelJson<any>(raw1);
    if (parsed1 && qualityPass(parsed1, anchors, input.plan, domain)) {
      return normalizeReflection(parsed1, domain);
    }

    const systemRetry2 = `
${systemBase}

RETRY (STRICT):
Your previous output was either not valid JSON OR did not meet requirements.
Now:
- Include ONE ANCHOR verbatim in "What’s really happening:"
- Include TWO concrete moments from THIS entry (one primary + one secondary).
- Stay inside the domain: ${domain}. Do not drift to any other life area.
Return ONLY valid JSON.
`.trim();

    const raw2 = await callGroq({ temperature: 0.25, system: systemRetry2 });
    const parsed2 = parseModelJson<any>(raw2);
    if (parsed2 && qualityPass(parsed2, anchors, input.plan, domain)) {
      return normalizeReflection(parsed2, domain);
    }

    const systemRetry3 = `
${systemBase}

FINAL ATTEMPT:
You MUST include EXACTLY ONE ANCHOR verbatim in the summary line "What’s really happening:".
Also include a second concrete moment from THIS entry.
Stay inside the domain: ${domain}.
Return ONLY valid JSON.
`.trim();

    const raw3 = await callGroq({ temperature: 0.12, system: systemRetry3 });
    const parsed3 = parseModelJson<any>(raw3);
    if (parsed3 && qualityPass(parsed3, anchors, input.plan, domain)) {
      return normalizeReflection(parsed3, domain);
    }

    // Fallbacks remain as you had them (unchanged)…
    const a1 = anchors[0] || "a moment felt important";
    const continuityLine = recentThemes.length
      ? `This echoes a theme you’ve touched before: ${recentThemes[0]}.`
      : "";

    if (domain === "FITNESS") {
      return normalizeReflection(
        {
          summary:
            input.plan === "PREMIUM"
              ? `What you’re carrying: Pride with fatigue — you did something hard and your body is asking for recovery.\nWhat’s really happening: ${a1} — and it’s creating a tension between “push more” and “respect your limits.”\nDeeper direction: Build consistency without turning discipline into self-pressure.\n${continuityLine}`.trim()
              : `What you’re carrying: Pride with fatigue — you did something hard and your body is asking for recovery.\nWhat’s really happening: ${a1} — and it’s creating a tension between “push more” and “respect your limits.”\n${continuityLine}`.trim(),
          core_pattern:
            "You’re proud of progress, but you’re still learning the line between healthy challenge and unnecessary pressure.",
          themes: ["consistency", "recovery", "self-respect", "motivation"],
          emotions: ["pride", "tiredness", "uncertainty", "determination"],
          gentle_next_step:
            input.plan === "PREMIUM"
              ? "Option A: Decide one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow’s effort as “easy” or “hard” before you start. Script line: “I’m building consistency, and recovery is part of the plan.”"
              : "Option A: Choose one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow’s effort as “easy” or “hard” before you start.",
          questions: [
            "What did you prove to yourself by showing up today?",
            "What would “healthy discipline” look like this week (not perfection)?",
            "What is one recovery signal your body gives you that you tend to ignore?",
            "Next time, paste your exact self-talk after the workout and what you did next.",
          ],
        },
        domain
      );
    }

    return normalizeReflection(
      {
        summary:
          input.plan === "PREMIUM"
            ? `What you’re carrying: Something important is asking for clarity.\nWhat’s really happening: ${a1} — and you’re still searching for the cleanest meaning.\nDeeper direction: Turn this into a simple next move you can repeat.\n${continuityLine}`.trim()
            : `What you’re carrying: Something important is asking for clarity.\nWhat’s really happening: ${a1} — and you’re still searching for the cleanest meaning.\n${continuityLine}`.trim(),
        core_pattern:
          "You’re trying to make sense of the moment while protecting your self-respect.",
        themes: ["clarity", "self-respect", "communication"],
        emotions: ["confusion", "frustration", "uncertainty"],
        gentle_next_step:
          input.plan === "PREMIUM"
            ? "Option A: Name the impact in one sentence and stop. Option B: Ask one clean question that would reduce guessing. Script line: “I want to be clear about what I need next.”"
            : "Option A: Name the impact in one sentence and stop. Option B: Ask one clean question that would reduce guessing.",
        questions: [
          "What felt most threatened in the moment—your dignity, your safety, or your competence?",
          "What interpretation is most accurate (not most painful)?",
          "What request or boundary would protect you without escalating?",
          "Next time, paste the exact words that stung and what you did immediately after.",
        ],
      },
      domain
    );
  } finally {
    clearTimeout(timeout);
  }
}
