// lib/ai/generateReflection.ts
// Havenly V12 — Smarter Domain Lock | Quality Gate with Failure Reasons | Per-Attempt Timeout

export type Reflection = {
  summary: string;
  corepattern?: string;
  themes: string[];
  emotions: string[];
  gentlenextstep: string;
  questions: string[];
};

type Input = {
  title?: string;
  content: string;
  plan: "FREE" | "PREMIUM";
  recentThemes?: string[];
};

type Domain = "WORK" | "RELATIONSHIP" | "FITNESS" | "GENERAL";

// ─── Domain Detection (weighted scoring) ─────────────────────────────────────

const DOMAIN_SIGNALS: Record<Domain, RegExp[]> = {
  FITNESS: [
    /\b(ran|run|running|jog(ged)?|sprint(ed)?)\b/,
    /\b(workout|training|exercise|gym|lifting|cardio)\b/,
    /\b(pace|steps?|miles?|kilometres?|km|5k|10k)\b/,
    /\b(sore|recovery|rest day|hydration|protein|reps|sets)\b/,
    /\b(sleep|tired|exhausted|fatigue)\b/,
  ],
  WORK: [
    /\b(colleague|coworker|manager|boss|team|client)\b/,
    /\b(meeting|office|project|deadline|presentation)\b/,
    /\b(work|job|career|promotion|performance review)\b/,
  ],
  RELATIONSHIP: [
    /\b(partner|wife|husband|girlfriend|boyfriend|spouse)\b/,
    /\b(relationship|love|date|argue|fight|break ?up)\b/,
    /\b(family|friend|parents?|sibling)\b/,
  ],
  GENERAL: [],
};

function scoreDomain(text: string): Record<Domain, number> {
  const s = text.toLowerCase();
  const scores: Record<Domain, number> = { FITNESS: 0, WORK: 0, RELATIONSHIP: 0, GENERAL: 0 };
  for (const [domain, patterns] of Object.entries(DOMAIN_SIGNALS) as [Domain, RegExp[]][]) {
    for (const p of patterns) {
      if (p.test(s)) scores[domain]++;
    }
  }
  return scores;
}

function detectDomain(text: string): Domain {
  const scores = scoreDomain(text);
  const sorted = (Object.entries(scores) as [Domain, number][])
    .filter(([d]) => d !== "GENERAL")
    .sort(([, a], [, b]) => b - a);

  const [top, second] = sorted;
  // Only assign a specific domain if it clearly wins (not a tie)
  if (top[1] > 0 && top[1] > (second?.[1] ?? 0)) return top[0];
  return "GENERAL";
}

// ─── Domain Defaults ──────────────────────────────────────────────────────────

type DomainDefaults = {
  summary: string;
  corepattern: string;
  themes: string[];
  emotions: string[];
  nextStepFree: string;
  nextStepPremium: string;
  questions: string[];
  driftKeywords: RegExp;
  mustHave: RegExp;
};

const DOMAIN_DEFAULTS: Record<Domain, DomainDefaults> = {
  FITNESS: {
    summary:
      "What you're carrying: Pride mixed with fatigue — you did something hard and your body is asking for recovery.\nWhat's really happening: You're negotiating the line between healthy challenge and unnecessary pressure.",
    corepattern:
      "You're proud of progress, but still learning the line between healthy challenge and unnecessary pressure.",
    themes: ["consistency", "recovery", "self-respect", "motivation"],
    emotions: ["pride", "tiredness", "uncertainty", "determination"],
    nextStepFree:
      'Option A: Choose one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow\'s effort as "easy" or "hard" before you start.',
    nextStepPremium:
      'Option A: Choose one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow\'s effort as "easy" or "hard" before you start. Script line: "I\'m building consistency, and recovery is part of the plan."',
    questions: [
      "What did you prove to yourself by showing up today?",
      'What would "healthy discipline" look like this week (not perfection)?',
      "What is one recovery signal your body gives you that you tend to ignore?",
      "Next time, paste your exact self-talk after the workout and what you did next.",
    ],
    mustHave:
      /\b(ran|run|running|workout|training|exercise|recovery|rest|sleep|hydration|pace|cardio|\d+\s*km|\d+\s*k)\b/,
    driftKeywords:
      /\b(colleague|coworker|manager|meeting|office|partner|wife|husband|girlfriend|boyfriend|argument|speaking up|keep the peace)\b/,
  },
  WORK: {
    summary:
      "What you're carrying: A workplace moment that left a mark.\nWhat's really happening: Something in that dynamic touched your sense of value or competence.",
    corepattern:
      "You're navigating a tension between your professional self-worth and external expectations.",
    themes: ["clarity", "communication", "boundaries"],
    emotions: ["frustration", "uncertainty", "determination"],
    nextStepFree:
      "Option A: Write down the one thing you wish had gone differently. Option B: Name what you'd want to say if there were no consequences.",
    nextStepPremium:
      'Option A: Write down the one thing you wish had gone differently. Option B: Name what you\'d want to say if there were no consequences. Script line: "I need to be clear about what I need here."',
    questions: [
      "What felt most dismissed — your idea, your effort, or your presence?",
      "What would a calm, direct version of yourself say in that moment?",
      "What boundary, if stated clearly, would protect you without escalating?",
      "Next time, write down the exact words exchanged and your immediate reaction.",
    ],
    mustHave: /\b(work|meeting|colleague|manager|office|team|project|boss|client)\b/,
    driftKeywords:
      /\b(partner|wife|husband|girlfriend|boyfriend|relationship|workout|running|gym)\b/,
  },
  RELATIONSHIP: {
    summary:
      "What you're carrying: Something in this connection left you unsettled.\nWhat's really happening: A gap between what you felt and what was expressed is asking for attention.",
    corepattern:
      "You're trying to protect your self-respect while staying connected to someone who matters.",
    themes: ["connection", "communication", "self-worth"],
    emotions: ["hurt", "confusion", "longing"],
    nextStepFree:
      "Option A: Name the feeling in one sentence without assigning blame. Option B: Ask yourself what you most needed in that moment.",
    nextStepPremium:
      'Option A: Name the feeling in one sentence without assigning blame. Option B: Ask yourself what you most needed in that moment. Script line: "I want to understand this before I respond."',
    questions: [
      "What exactly did that moment trigger — anger, shame, fear, or something else?",
      "What's the most generous interpretation that still respects your feelings?",
      "What would you ask for if you knew you'd be heard without judgment?",
      "Next time, paste the exact words that stung and what you did immediately after.",
    ],
    mustHave: /\b(partner|wife|husband|girlfriend|boyfriend|relationship|family|friend|love|date)\b/,
    driftKeywords: /\b(colleague|manager|meeting|workout|gym|running)\b/,
  },
  GENERAL: {
    summary:
      "What you're carrying: Something important is asking for clarity.\nWhat's really happening: The meaning of what happened isn't sitting right inside you yet.",
    corepattern: "You're trying to make sense of the moment while protecting your self-respect.",
    themes: ["clarity", "self-respect", "communication"],
    emotions: ["confusion", "frustration", "uncertainty"],
    nextStepFree:
      "Option A: Name the moment in one sentence. Option B: Ask one clean question to clarify what you need next.",
    nextStepPremium:
      'Option A: Name the moment in one sentence. Option B: Ask one clean question to clarify what you need next. Script line: "I want to be clear about what I need next."',
    questions: [
      "What exactly did the moment trigger in you — anger, shame, fear, sadness, or something else?",
      "What is the cleanest interpretation that still respects your feelings?",
      "What boundary or request would protect you without escalating the situation?",
      "Next time, paste the exact words that stung and what you did immediately after.",
    ],
    mustHave: /./, // always passes
    driftKeywords: /(?!)/,
  },
};

// ─── Anchor Extraction ────────────────────────────────────────────────────────

function extractAnchors(entry: string): string[] {
  const t = entry.trim();
  const seen = new Set<string>();
  const anchors: string[] = [];

  const add = (s: string) => {
    const v = s.trim();
    if (!v) return;
    const key = v.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) return;
    seen.add(key);
    anchors.push(v);
  };

  // 1. Quoted speech first (highest signal)
  for (const m of t.matchAll(/["""]([^"""]{4,90})["""]/g)) {
    add(`"${m[1]}"`);
    if (anchors.length >= 3) break;
  }

  // 2. First 1-2 concrete sentences
  if (anchors.length < 2) {
    const sentences = t.split(/\n|(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    for (const s of sentences.slice(0, 4)) {
      add(s.length > 110 ? s.slice(0, 110).trim() : s);
      if (anchors.length >= 2) break;
    }
  }

  // 3. Situational patterns
  const patterns: [RegExp, string][] = [
    [/in front of (others|people|everyone)/i, "in front of others"],
    [/colleague|coworker|manager|team|meeting/i, "a work moment landed as a put-down"],
    [/smiled|laughed it off|kept it in|stayed silent/i, "you smiled in the moment, then replayed it later"],
    [/replaying|kept replaying|ruminat/i, "you kept replaying it and felt small"],
    [/don't want to start a fight|avoid conflict|respond without starting a fight/i, "you want to respond without starting a fight"],
    [/\b(tired|exhausted|fatigue)\b/i, "part of you wants rest while another wants to push harder"],
    [/improving|progress|forcing myself|discipline/i, "you're questioning whether this is growth or pressure"],
  ];

  for (const [re, label] of patterns) {
    if (re.test(t)) add(label);
  }

  // 4. Fitness-specific anchors
  if (/ran\s*5\s*k(m)?\b/i.test(t)) {
    add("I ran 5km today and felt proud but also tired");
  } else if (DOMAIN_DEFAULTS.FITNESS.mustHave.test(t.toLowerCase())) {
    add("you exercised and felt proud but also tired");
  }

  if (anchors.length < 2) {
    add("a moment felt important");
    add("you want clarity about what it means");
  }

  return anchors.slice(0, 5);
}

// ─── JSON Parsing ─────────────────────────────────────────────────────────────

function parseModelJson<T>(raw: string): T | null {
  const cleaned = raw
    .replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try { return JSON.parse(cleaned.slice(start, end + 1)) as T; } catch { }
    }
    return null;
  }
}

// ─── Quality Gate (with failure reasons for smart retries) ────────────────────

type QualityResult = { pass: true } | { pass: false; reasons: string[] };

function qualityCheck(
  parsed: any,
  anchors: string[],
  plan: "FREE" | "PREMIUM",
  domain: Domain
): QualityResult {
  const reasons: string[] = [];
  const defaults = DOMAIN_DEFAULTS[domain];

  const summary = String(parsed?.summary ?? "").trim();
  const nextStep = String(parsed?.gentlenextstep ?? "").trim();
  const themes: unknown[] = Array.isArray(parsed?.themes) ? parsed.themes : [];
  const emotions: unknown[] = Array.isArray(parsed?.emotions) ? parsed.emotions : [];
  const questions: unknown[] = Array.isArray(parsed?.questions) ? parsed.questions : [];

  const fullText = [summary, nextStep, ...questions].join("\n").toLowerCase();

  // Anchor check
  const hasAnchor = anchors.some(a =>
    fullText.includes(a.toLowerCase().replace(/^[""]|[""]$/g, "").trim())
  );
  if (!hasAnchor) reasons.push("Missing verbatim anchor");

  // Summary structure
  if (!summary.includes("What you're carrying:")) reasons.push('Missing "What you\'re carrying:" label');
  if (!summary.includes("What's really happening:")) reasons.push('Missing "What\'s really happening:" label');
  if (plan === "PREMIUM" && !summary.includes("Deeper direction:"))
    reasons.push('Missing "Deeper direction:" label (PREMIUM)');

  // Length
  const minLen = plan === "PREMIUM" ? 240 : 150;
  if (summary.length < minLen)
    reasons.push(`Summary too short (${summary.length} < ${minLen})`);

  // Next step
  if (!/Option A:/i.test(nextStep)) reasons.push("Missing Option A in gentlenextstep");
  if (!/Option B:/i.test(nextStep)) reasons.push("Missing Option B in gentlenextstep");
  if (plan === "PREMIUM" && !/Script line:/i.test(nextStep))
    reasons.push("Missing Script line in gentlenextstep (PREMIUM)");

  // Array minimums
  const minArr = plan === "PREMIUM" ? 3 : 2;
  if (themes.length < minArr) reasons.push(`themes: need ${minArr}, got ${themes.length}`);
  if (emotions.length < minArr) reasons.push(`emotions: need ${minArr}, got ${emotions.length}`);
  if (questions.length < 2) reasons.push(`questions: need 2, got ${questions.length}`);

  // Last question must start with "Next time,"
  const lastQ = String(questions[questions.length - 1] ?? "");
  if (!lastQ.toLowerCase().startsWith("next time,"))
    reasons.push('Last question must start with "Next time,"');

  // Domain lock
  if (domain !== "GENERAL") {
    if (!defaults.mustHave.test(fullText))
      reasons.push(`Domain signal missing for ${domain}`);
    if (defaults.driftKeywords.test(fullText))
      reasons.push(`Domain drift detected for ${domain}`);
  }

  return reasons.length === 0 ? { pass: true } : { pass: false, reasons };
}

// ─── Normalization ────────────────────────────────────────────────────────────

function normalizeReflection(r: any, domain: Domain): Reflection {
  const defaults = DOMAIN_DEFAULTS[domain];

  const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const cleanArr = (v: unknown, max: number): string[] =>
    Array.isArray(v)
      ? v.map(x => String(x ?? "").trim()).filter(Boolean).slice(0, max)
      : [];

  const questions = ensureFourQuestions(cleanArr(r?.questions, 6), domain);

  return {
    summary: clean(r?.summary) || defaults.summary,
    corepattern: clean(r?.corepattern) || defaults.corepattern,
    themes: cleanArr(r?.themes, 6).length ? cleanArr(r.themes, 6) : defaults.themes,
    emotions: cleanArr(r?.emotions, 6).length ? cleanArr(r.emotions, 6) : defaults.emotions,
    gentlenextstep: clean(r?.gentlenextstep) || defaults.nextStepFree,
    questions,
  };
}

function ensureFourQuestions(qs: string[], domain: Domain): string[] {
  const defaults = DOMAIN_DEFAULTS[domain].questions;
  const out = qs.filter(Boolean).slice(0, 4);
  while (out.length < 4) out.push(defaults[out.length]);
  if (!out[out.length - 1].toLowerCase().startsWith("next time,")) {
    out[out.length - 1] = defaults[3];
  }
  return out;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildSystemPrompt(plan: "FREE" | "PREMIUM", domain: Domain): string {
  const isPremium = plan === "PREMIUM";

  const summaryStructure = isPremium
    ? `1) "What you're carrying:"\n  2) "What's really happening:"\n  3) "Deeper direction:"`
    : `1) "What you're carrying:"\n  2) "What's really happening:"`;

  const nextStepStructure = isPremium
    ? `"Option A:" and "Option B:" and "Script line:" (1–2 calm, non-pushy sentences)`
    : `"Option A:" and "Option B:"`;

  return `
You are Havenly — a Wise Reflective Mirror.

VOICE: Write directly to "you". Never say "the user" or "this person".

TRUTH (NON-NEGOTIABLE):
- Never invent events not in the entry.
- Reference at least ONE concrete moment from the entry.
- Include at least ONE ANCHOR verbatim in the response.
- Never use placeholders like "a situation happened." Name the situation.

DOMAIN GUARDRAIL — Active domain: ${domain}
- Stay strictly inside this domain.
- FITNESS → No colleagues, partners, conflict, speaking up, keeping the peace.
- WORK → No relationship/partner dynamics (unless explicitly present).
- RELATIONSHIP → No workplace dynamics (unless explicitly present).

TONE: Grounded, calm, perceptive. Not clinical, not preachy, not flattering.

STRUCTURE:
- summary must contain labeled sections in order:
  ${summaryStructure}

- corepattern: ONE concise sentence naming the deeper dynamic.

- gentlenextstep must include:
  ${nextStepStructure}

- questions: exactly 4. The LAST must start with: "Next time,"

OUTPUT: Return ONLY valid JSON with double-quoted strings. No markdown, no code fences.
Schema:
{
  "summary": "…",
  "corepattern": "…",
  "themes": ["…"],
  "emotions": ["…"],
  "gentlenextstep": "…",
  "questions": ["…"]
}`.trim();
}

// ─── Groq Caller ─────────────────────────────────────────────────────────────

async function callGroq(opts: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  maxTokens: number;
  temperature: number;
  timeoutMs?: number;
}): Promise<string> {
  const { apiKey, model, system, user, maxTokens, temperature, timeoutMs = 30_000 } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Groq ${res.status}: ${text}`);
    }

    const data: any = await res.json();
    return String(data?.choices?.[0]?.message?.content ?? "");
  } finally {
    clearTimeout(timer);
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQAPIKEY || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQAPIKEY");

  const model = process.env.GROQMODEL || "llama-3.3-70b-versatile";
  const entryBody = (input.content || "").trim();
  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${entryBody}`;

  const domain = detectDomain(entryBody);
  const anchors = extractAnchors(entryBody);
  const anchorsBlock = anchors.map((a, i) => `${i + 1}) ${a}`).join("\n");

  const recentThemes = (input.recentThemes || [])
    .map(s => String(s).trim())
    .filter(Boolean)
    .slice(0, 5);

  const memoryBlock = recentThemes.length
    ? `RECENT THEMES (optional context, do NOT overreach):\n${recentThemes.map((t, i) => `${i + 1}) ${t}`).join("\n")}`
    : "";

  const userPrompt = `
User plan: ${input.plan}

${memoryBlock}

ANCHORS (include at least ONE verbatim in your response):
${anchorsBlock}

Reflect on this journal entry:
${entryText}`.trim();

  const maxTokens = input.plan === "PREMIUM" ? 1050 : 700;
  const systemPrompt = buildSystemPrompt(input.plan, domain);

  const ATTEMPTS: { temperature: number; extraInstruction?: string }[] = [
    { temperature: input.plan === "PREMIUM" ? 0.55 : 0.45 },
    { temperature: 0.25, extraInstruction: "Include ONE ANCHOR verbatim in 'What's really happening:'. Add a second concrete moment from the entry. Do NOT drift to another life area." },
    { temperature: 0.12, extraInstruction: "FINAL ATTEMPT. You MUST include ONE ANCHOR verbatim in 'What's really happening:' and a second concrete moment. Stay in the domain. Return ONLY valid JSON." },
  ];

  for (let i = 0; i < ATTEMPTS.length; i++) {
    const attempt = ATTEMPTS[i];
    const system = attempt.extraInstruction
      ? `${systemPrompt}\n\nRETRY NOTE: ${attempt.extraInstruction}`
      : systemPrompt;

    const raw = await callGroq({
      apiKey, model, system, user: userPrompt,
      maxTokens, temperature: attempt.temperature,
    });

    const parsed = parseModelJson<any>(raw);
    if (!parsed) continue;

    const result = qualityCheck(parsed, anchors, input.plan, domain);
    if (result.pass) return normalizeReflection(parsed, domain);

    // On last attempt before fallback, log failures (server-side only)
    if (i === ATTEMPTS.length - 1) {
      console.warn("[Havenly] All attempts failed. Reasons:", (result as { pass: false; reasons: string[] }).reasons);
    }
  }

  // ─── Guaranteed Fallback ──────────────────────────────────────────────────
  const defaults = DOMAIN_DEFAULTS[domain];
  const a1 = anchors[0] || "a moment felt important";
  const continuityLine = recentThemes.length
    ? `This echoes a theme you've touched before: ${recentThemes[0]}.`
    : "";

  const isPremium = input.plan === "PREMIUM";

  const fallbackSummaryLines = [
    defaults.summary,
    ...(isPremium ? [`Deeper direction: ${defaults.corepattern}`] : []),
    ...(continuityLine ? [continuityLine] : []),
  ];

  // Inject anchor into "What's really happening:" line
  const summaryWithAnchor = fallbackSummaryLines
    .join("\n")
    .replace(
      "What's really happening:",
      `What's really happening: ${a1} —`
    );

  return normalizeReflection(
    {
      summary: summaryWithAnchor,
      corepattern: defaults.corepattern,
      themes: defaults.themes,
      emotions: defaults.emotions,
      gentlenextstep: isPremium ? defaults.nextStepPremium : defaults.nextStepFree,
      questions: defaults.questions,
    },
    domain
  );
}
