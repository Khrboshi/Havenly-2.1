// lib/ai/generateReflection.ts
// Havenly V13 — Smarter GENERAL domain | Lead-domain for mixed entries | Short-entry compassion

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

// ─── Domain Detection (weighted scoring + lead-domain for mixed entries) ───────
//
// FIX 2: Instead of falling back to GENERAL on a tie, we now pick the domain
// with the strongest EMOTIONAL signal. "I had an argument with my partner"
// outweighs "I went for a run" when the entry is clearly about the relationship.

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
    /\b(work|job|career|promotion|performance.?review)\b/,
  ],
  RELATIONSHIP: [
    /\b(partner|wife|husband|girlfriend|boyfriend|spouse)\b/,
    /\b(relationship|love|date|argu(e|ed|ment)|fight|break.?up)\b/,
    /\b(family|friend|parents?|sibling)\b/,
  ],
  GENERAL: [],
};

// Emotional weight boosters — if an entry contains these alongside a domain
// signal, that domain wins the tie-break.
const EMOTIONAL_BOOSTERS: Record<Exclude<Domain, "GENERAL">, RegExp[]> = {
  WORK: [
    /\b(humiliat|embarrass|dismiss|invisible|overlooked|undervalued|unfair)\b/,
    /\b(cried|crying|tears|hurt|angry|rage|shame)\b/,
    /\b(replaying|can't let go|kept thinking|couldn't sleep after)\b/,
  ],
  RELATIONSHIP: [
    /\b(invisible|lonely|disconnected|unloved|unheard|ignored|taken for granted)\b/,
    /\b(cried|crying|hurt|heartbreak|ache|longing|miss)\b/,
    /\b(fine isn't what I wanted|didn't ask|didn't notice|wasn't there)\b/,
  ],
  FITNESS: [
    /\b(proud|accomplished|strong|powerful|beat my)\b/,
    /\b(pushing too hard|overdid|burnout|injury|pain)\b/,
  ],
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

function emotionalBoost(text: string, domain: Exclude<Domain, "GENERAL">): number {
  const s = text.toLowerCase();
  let boost = 0;
  for (const p of EMOTIONAL_BOOSTERS[domain]) {
    if (p.test(s)) boost++;
  }
  return boost;
}

export function detectDomain(text: string): Domain {
  const scores = scoreDomain(text);
  const candidates = (Object.entries(scores) as [Domain, number][])
    .filter(([d]) => d !== "GENERAL" && scores[d] > 0)
    .sort(([, a], [, b]) => b - a);

  if (candidates.length === 0) return "GENERAL";

  const [top, second] = candidates;

  // Clear winner — no tie-break needed
  if (!second || top[1] > second[1]) return top[0];

  // Tie — use emotional boost to pick the lead domain
  const topBoost = emotionalBoost(text, top[0] as Exclude<Domain, "GENERAL">);
  const secondBoost = emotionalBoost(text, second[0] as Exclude<Domain, "GENERAL">);

  if (topBoost >= secondBoost) return top[0];
  return second[0];
}

// ─── Short Entry Detection ────────────────────────────────────────────────────
//
// FIX 3: entries under ~10 words are treated as "short" and get a different
// tone — curious and gentle, not analytical. Avoids generic clarity templates.

function isShortEntry(text: string): boolean {
  return text.trim().split(/\s+/).length < 12;
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
  shortSummary: string;         // FIX 3: special summary for short/sparse entries
  shortNextStep: string;        // FIX 3: gentler next step for short entries
  shortQuestions: string[];     // FIX 3: curiosity-first questions for short entries
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
      "Option A: Choose one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow's effort as \"easy\" or \"hard\" before you start.",
    nextStepPremium:
      "Option A: Choose one recovery action today (sleep, hydration, easy walk) and treat it as training. Option B: Define tomorrow's effort as \"easy\" or \"hard\" before you start. Script line: \"I'm building consistency, and recovery is part of the plan.\"",
    questions: [
      "What did you prove to yourself by showing up today?",
      "What would \"healthy discipline\" look like this week (not perfection)?",
      "What is one recovery signal your body gives you that you tend to ignore?",
      "Next time, paste your exact self-talk after the workout and what you did next.",
    ],
    shortSummary:
      "What you're carrying: A quiet sense that something in your body or energy is asking to be noticed.\nWhat's really happening: You showed up — and that's the part worth sitting with before asking what comes next.",
    shortNextStep:
      "Option A: Notice one physical sensation right now and name it without judging it. Option B: Write one sentence about what \"showing up\" costs you lately.",
    shortQuestions: [
      "What does your body feel like right now — not good or bad, just what's actually there?",
      "What would rest look like today that doesn't feel like giving up?",
      "What would you tell a friend who said exactly what you just wrote?",
      "Next time, write two more sentences — what's underneath the first feeling?",
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
    themes: ["recognition", "boundaries", "self-worth"],
    emotions: ["frustration", "hurt", "determination"],
    nextStepFree:
      "Option A: Write down the one thing you wish had gone differently. Option B: Name what you'd want to say if there were no consequences.",
    nextStepPremium:
      "Option A: Write down the one thing you wish had gone differently. Option B: Name what you'd want to say if there were no consequences. Script line: \"I need to be clear about what I need here.\"",
    questions: [
      "What felt most dismissed — your idea, your effort, or your presence?",
      "What would a calm, direct version of yourself say in that moment?",
      "What boundary, if stated clearly, would protect you without escalating?",
      "Next time, write down the exact words exchanged and your immediate reaction.",
    ],
    shortSummary:
      "What you're carrying: Something from work is sitting with you — quietly, but persistently.\nWhat's really happening: Even a few words can hold a lot of weight when they touch your sense of worth.",
    shortNextStep:
      "Option A: Finish this sentence — \"What I actually needed in that moment was...\". Option B: Write down one thing you want to be different next time.",
    shortQuestions: [
      "What's the one word that best describes how that made you feel?",
      "If a colleague described the same situation, what would you tell them?",
      "What would it look like to protect yourself here without escalating?",
      "Next time, write more — what happened just before, and just after?",
    ],
    mustHave: /\b(work|meeting|colleague|manager|office|team|project|boss|client|performance)\b/,
    driftKeywords:
      /\b(partner|wife|husband|girlfriend|boyfriend|workout|running|gym)\b/,
  },

  RELATIONSHIP: {
    summary:
      "What you're carrying: Something in this connection left you unsettled.\nWhat's really happening: A gap between what you felt and what was expressed is asking for attention.",
    corepattern:
      "You're trying to protect your self-respect while staying connected to someone who matters.",
    themes: ["connection", "visibility", "self-worth"],
    emotions: ["hurt", "longing", "confusion"],
    nextStepFree:
      "Option A: Name the feeling in one sentence without assigning blame. Option B: Ask yourself what you most needed in that moment.",
    nextStepPremium:
      "Option A: Name the feeling in one sentence without assigning blame. Option B: Ask yourself what you most needed in that moment. Script line: \"I want to understand this before I respond.\"",
    questions: [
      "What exactly did that moment trigger — anger, shame, fear, or something else?",
      "What's the most generous interpretation that still respects your feelings?",
      "What would you ask for if you knew you'd be heard without judgment?",
      "Next time, paste the exact words that stung and what you did immediately after.",
    ],
    shortSummary:
      "What you're carrying: A quiet ache around a connection that matters to you.\nWhat's really happening: Something small happened — or didn't happen — and it landed harder than it looked.",
    shortNextStep:
      "Option A: Finish this sentence — \"What I actually needed was...\". Option B: Notice whether you want to say something, or just to be seen.",
    shortQuestions: [
      "What's the feeling underneath the low — is it loneliness, disappointment, or something else?",
      "Who or what came to mind when you wrote this?",
      "What would it feel like to say this feeling out loud to someone safe?",
      "Next time, write two more sentences — what happened before this feeling arrived?",
    ],
    mustHave: /\b(partner|wife|husband|girlfriend|boyfriend|relationship|family|friend|love|date|he |she |they )\b/,
    driftKeywords: /\b(colleague|manager|meeting|workout|gym|running)\b/,
  },

  GENERAL: {
    // FIX 1: GENERAL fallback no longer says "Something important is asking for clarity"
    // It now uses the entry's own anchor and reflects the emotional tone present.
    summary:
      "What you're carrying: Something is sitting with you — not fully named yet, but real.\nWhat's really happening: You wrote it down, which means part of you is already trying to make sense of it.",
    corepattern:
      "You're in the middle of something — not at the beginning, not at the end, just present with it.",
    themes: ["self-awareness", "processing", "presence"],
    emotions: ["uncertainty", "restlessness", "quiet courage"],
    nextStepFree:
      "Option A: Write one more sentence — what's the feeling underneath the first one? Option B: Ask yourself: is this about something that happened, something expected, or something missing?",
    nextStepPremium:
      "Option A: Write one more sentence — what's the feeling underneath the first one? Option B: Ask yourself: is this about something that happened, something expected, or something missing? Script line: \"I don't need to have the answer — I just need to stay with the question.\"",
    questions: [
      "What's the feeling that's hardest to name right now?",
      "Is this about something that happened, something you're expecting, or something you're missing?",
      "What would feel like one small step toward clarity — not resolution, just clarity?",
      "Next time, write for two more minutes without stopping — what else is there?",
    ],
    // FIX 3: Short GENERAL entries get the gentlest, most open response
    shortSummary:
      "What you're carrying: Something quiet — not loud enough to name yet, but present enough to notice.\nWhat's really happening: You showed up to write, even without words. That's the start of something.",
    shortNextStep:
      "Option A: Sit with it for 60 seconds and notice if a word arrives. Option B: Write one more line — it doesn't have to make sense.",
    shortQuestions: [
      "Where do you feel this in your body right now?",
      "If you had to guess what's underneath the \"not sure why\" — what would you say?",
      "What would help right now — company, quiet, movement, or something else?",
      "Next time, write for two more minutes without stopping — what else comes up?",
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
    [/\b(invisible|unheard|unseen)\b/i, "you felt invisible"],
    [/fine isn't what I wanted/i, "fine isn't what you wanted"],
    [/cried in the car|cried on the way/i, "you cried on the way home"],
    [/nodded and said thank you/i, "you nodded and said thank you instead of pushing back"],
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

// ─── Quality Gate ─────────────────────────────────────────────────────────────

type QualityResult = { pass: true } | { pass: false; reasons: string[] };

function qualityCheck(
  parsed: any,
  anchors: string[],
  plan: "FREE" | "PREMIUM",
  domain: Domain,
  short: boolean
): QualityResult {
  const reasons: string[] = [];
  const defaults = DOMAIN_DEFAULTS[domain];

  const summary = String(parsed?.summary ?? "").trim();
  const nextStep = String(parsed?.gentlenextstep ?? "").trim();
  const themes: unknown[] = Array.isArray(parsed?.themes) ? parsed.themes : [];
  const emotions: unknown[] = Array.isArray(parsed?.emotions) ? parsed.emotions : [];
  const questions: unknown[] = Array.isArray(parsed?.questions) ? parsed.questions : [];

  const fullText = [summary, nextStep, ...questions].join("\n").toLowerCase();

  // Anchor check — short entries are exempt (too little content to force verbatim)
  if (!short) {
    const hasAnchor = anchors.some(a =>
      fullText.includes(a.toLowerCase().replace(/^[""]|[""]$/g, "").trim())
    );
    if (!hasAnchor) reasons.push("Missing verbatim anchor");
  }

  // Summary structure
  if (!summary.includes("What you're carrying:")) reasons.push('Missing "What you\'re carrying:" label');
  if (!summary.includes("What's really happening:")) reasons.push('Missing "What\'s really happening:" label');
  if (plan === "PREMIUM" && !summary.includes("Deeper direction:"))
    reasons.push('Missing "Deeper direction:" label (PREMIUM)');

  // Length — shorter minimum for short entries
  const minLen = short ? 80 : (plan === "PREMIUM" ? 240 : 150);
  if (summary.length < minLen)
    reasons.push(`Summary too short (${summary.length} < ${minLen})`);

  // Next step
  if (!/Option A:/i.test(nextStep)) reasons.push("Missing Option A in gentlenextstep");
  if (!/Option B:/i.test(nextStep)) reasons.push("Missing Option B in gentlenextstep");
  if (plan === "PREMIUM" && !short && !/Script line:/i.test(nextStep))
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

  // Domain lock — skip for GENERAL (no mustHave/drift for general)
  if (domain !== "GENERAL") {
    if (!defaults.mustHave.test(fullText))
      reasons.push(`Domain signal missing for ${domain}`);
    if (defaults.driftKeywords.test(fullText))
      reasons.push(`Domain drift detected for ${domain}`);
  }

  return reasons.length === 0 ? { pass: true } : { pass: false, reasons };
}

// ─── Normalization ────────────────────────────────────────────────────────────

function normalizeReflection(r: any, domain: Domain, short: boolean): Reflection {
  const defaults = DOMAIN_DEFAULTS[domain];

  const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const cleanArr = (v: unknown, max: number): string[] =>
    Array.isArray(v)
      ? v.map(x => String(x ?? "").trim()).filter(Boolean).slice(0, max)
      : [];

  const questions = ensureFourQuestions(cleanArr(r?.questions, 6), domain, short);

  const fallbackSummary = short ? defaults.shortSummary : defaults.summary;
  const fallbackNextStep = short ? defaults.shortNextStep : defaults.nextStepFree;

  return {
    summary: clean(r?.summary) || fallbackSummary,
    corepattern: clean(r?.corepattern) || defaults.corepattern,
    themes: cleanArr(r?.themes, 6).length ? cleanArr(r.themes, 6) : defaults.themes,
    emotions: cleanArr(r?.emotions, 6).length ? cleanArr(r.emotions, 6) : defaults.emotions,
    gentlenextstep: clean(r?.gentlenextstep) || fallbackNextStep,
    questions,
  };
}

function ensureFourQuestions(qs: string[], domain: Domain, short: boolean): string[] {
  const defaults = short
    ? DOMAIN_DEFAULTS[domain].shortQuestions
    : DOMAIN_DEFAULTS[domain].questions;
  const out = qs.filter(Boolean).slice(0, 4);
  while (out.length < 4) out.push(defaults[out.length] ?? defaults[defaults.length - 1]);
  if (!out[out.length - 1].toLowerCase().startsWith("next time,")) {
    out[out.length - 1] = defaults[3] ?? defaults[defaults.length - 1];
  }
  return out;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildSystemPrompt(plan: "FREE" | "PREMIUM", domain: Domain, short: boolean): string {
  const isPremium = plan === "PREMIUM";

  const summaryStructure = isPremium && !short
    ? `1) "What you're carrying:"\n  2) "What's really happening:"\n  3) "Deeper direction:"`
    : `1) "What you're carrying:"\n  2) "What's really happening:"`;

  const nextStepStructure = isPremium && !short
    ? `"Option A:" and "Option B:" and "Script line:" (1–2 calm, non-pushy sentences)`
    : `"Option A:" and "Option B:"`;

  // FIX 1 & 3: Domain-specific guidance injected directly into the prompt
  const domainGuidance = {
    WORK: `
DOMAIN: WORK
This person is dealing with a workplace situation. Your reflection MUST name the specific dynamic at work — humiliation, dismissal, being overlooked, or tension around authority.
Do NOT drift to relationship or fitness language.
The "What's really happening:" line must name what was touched — dignity, competence, recognition, or safety.`,

    RELATIONSHIP: `
DOMAIN: RELATIONSHIP
This person is dealing with a relationship dynamic. Your reflection MUST name the specific feeling — invisible, disconnected, longing, or hurt.
Do NOT drift to workplace or fitness language.
The "What's really happening:" line must name what the gap was — attention, care, presence, or reciprocity.`,

    FITNESS: `
DOMAIN: FITNESS
This person is processing a physical/training experience. Stay in this lane.
Do NOT mention colleagues, partners, conflict, or interpersonal dynamics unless they explicitly appeared.
The "What's really happening:" line must be about the body, energy, or the inner voice around training.`,

    GENERAL: `
DOMAIN: GENERAL — MIXED or UNCLEAR
This entry touches multiple areas or has very little signal.
DO NOT default to "Something important is asking for clarity" — that is a placeholder and it is forbidden.
Instead: use the person's EXACT words in "What's really happening:" and reflect what emotion is most present.
If the entry is short or sparse, be gentle and curious — NOT analytical. Lead with warmth, not frameworks.`,
  }[domain];

  const shortGuidance = short
    ? `
SHORT ENTRY GUIDANCE:
This entry is very short (under 12 words). This is not a failure — it is a signal.
DO NOT try to extract themes that aren't there. DO NOT be analytical.
Instead: reflect warmth, curiosity, and presence. The person showed up — acknowledge that.
Keep "What you're carrying:" and "What's really happening:" brief and open, not prescriptive.
Questions should be gentle and open-ended — invite more, don't demand more.`
    : "";

  return `
You are Havenly — a Wise Reflective Mirror.

VOICE: Write directly to "you". Never say "the user" or "this person".

TRUTH (NON-NEGOTIABLE):
- Never invent events not in the entry.
- Reference at least ONE concrete moment or phrase from the entry verbatim.
- Never use generic placeholders. "Something important is asking for clarity" is BANNED — it tells the person nothing about themselves.
- "A moment felt important" is BANNED unless the entry is truly one sentence with no emotional signal.
${domainGuidance}
${shortGuidance}

TONE: Grounded, calm, perceptive. Not clinical. Not preachy. Not flattering. Not generic.

STRUCTURE:
- summary must contain these labeled sections in order:
  ${summaryStructure}

- corepattern: ONE sentence naming the underlying dynamic. Be specific to THIS entry.

- gentlenextstep must include:
  ${nextStepStructure}
  Both options must be things a real person could actually do today — not abstract.

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
  const short = isShortEntry(entryBody);
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
Entry length: ${short ? "SHORT (under 12 words) — be gentle and curious, not analytical" : "NORMAL"}

${memoryBlock}

ANCHORS (include at least ONE verbatim in your response${short ? " if possible" : ""}):
${anchorsBlock}

Reflect on this journal entry:
${entryText}`.trim();

  const maxTokens = input.plan === "PREMIUM" ? 1050 : 700;
  const systemPrompt = buildSystemPrompt(input.plan, domain, short);

  const ATTEMPTS: { temperature: number; extraInstruction?: string }[] = [
    { temperature: input.plan === "PREMIUM" ? 0.55 : 0.45 },
    {
      temperature: 0.25,
      extraInstruction: `Your previous output was rejected. Now: use the person's EXACT words from the entry in "What's really happening:". Stay in domain: ${domain}. Return ONLY valid JSON.`,
    },
    {
      temperature: 0.12,
      extraInstruction: `FINAL ATTEMPT. Domain: ${domain}. You MUST reference the person's actual words. "Something important is asking for clarity" is BANNED. Return ONLY valid JSON.`,
    },
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

    const result = qualityCheck(parsed, anchors, input.plan, domain, short);
    if (result.pass) return normalizeReflection(parsed, domain, short);

    if (i === ATTEMPTS.length - 1) {
      console.warn("[Havenly] All attempts failed. Domain:", domain, "Short:", short, "Reasons:", (result as any).reasons);
    }
  }

  // ─── Guaranteed Fallback ──────────────────────────────────────────────────
  const defaults = DOMAIN_DEFAULTS[domain];
  const a1 = anchors[0] || "what you wrote";
  const continuityLine = recentThemes.length
    ? `This echoes a theme you've touched before: ${recentThemes[0]}.`
    : "";

  const isPremium = input.plan === "PREMIUM";
  const baseSummary = short ? defaults.shortSummary : defaults.summary;

  const fallbackSummaryLines = [
    baseSummary,
    ...(isPremium && !short ? [`Deeper direction: ${defaults.corepattern}`] : []),
    ...(continuityLine ? [continuityLine] : []),
  ];

  // Always inject the anchor into "What's really happening:"
  const summaryWithAnchor = fallbackSummaryLines
    .join("\n")
    .replace(
      "What's really happening:",
      `What's really happening: ${a1} —`
    );

  const fallbackNextStep = short
    ? defaults.shortNextStep
    : isPremium
    ? defaults.nextStepPremium
    : defaults.nextStepFree;

  return normalizeReflection(
    {
      summary: summaryWithAnchor,
      corepattern: defaults.corepattern,
      themes: defaults.themes,
      emotions: defaults.emotions,
      gentlenextstep: fallbackNextStep,
      questions: short ? defaults.shortQuestions : defaults.questions,
    },
    domain,
    short
  );
}
