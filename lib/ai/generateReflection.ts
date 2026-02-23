// lib/ai/generateReflection.ts
// Havenly V11 — Wise Mirror + Anchors + Cross-Journal Memory (FREE SAFE)
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
  recentThemes?: string[]; // NEW — cross-journal memory (optional)
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
          "What is the real need underneath what you wrote?",
          "What would ‘enough’ look like for you—one sentence?",
          "What boundary would protect your self-respect here?",
          "Next time, paste the exact sentence that stung and what you did right after.",
        ];

  return {
    summary:
      summary ||
      "What you’re carrying: Something important is asking for clarity.\nWhat’s really happening: Your effort and meaning may not be landing the same way.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      "Option A: Write one sentence about what you hoped your effort meant. Option B: Ask yourself what appreciation looks like to you.",
    questions,
  };
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

/**
 * Anchor extraction — keeps reflections specific
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

  if (/expensive/i.test(t)) add("expensive gifts still feel “not enough”");
  if (/small.*gift|little gift/i.test(t)) add("small gifts from others make her happy");
  if (/paid for the gift/i.test(t)) add("you paid for a gift she gave to someone else");
  if (/night/i.test(t) && /road/i.test(t)) add("driving at night when the roads were bad");
  if (/weather/i.test(t)) add("bad weather while trying to get her home safely");
  if (/driving/i.test(t) && /worried/i.test(t)) add("she worried about your driving more than your intention");

  if (anchors.length < 2) {
    add("your big efforts feel unseen");
    add("small gestures from others land differently");
  }

  return anchors.slice(0, 5);
}

export async function generateReflectionFromEntry(
  input: Input
): Promise<Reflection> {

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryBody = (input.content || "").trim();
  const entryText = `${titleLine}Entry:\n${entryBody}`;

  const anchors = extractAnchors(entryBody);
  const anchorsBlock = anchors.map((a, i) => `${i + 1}) ${a}`).join("\n");

  const recentThemes = input.recentThemes?.slice(0,5) || [];
  const memoryBlock = recentThemes.length
    ? `RECENT THEMES FROM PREVIOUS JOURNALS:\n${recentThemes.map((t,i)=>`${i+1}) ${t}`).join("\n")}`
    : "";

  const systemBase = `
You are Havenly — a Wise Reflective Mirror.

VOICE:
Write directly to "you".

TRUTH:
- NEVER invent events.
- You MUST reference at least ONE concrete moment.
- You MUST include at least ONE ANCHOR exactly as written.

CROSS-JOURNAL MEMORY (FREE SAFE):
If RECENT THEMES exist, you MAY gently reference continuity like:
"this feels similar to a pattern you've explored before".
Do NOT analyze identity or give deep psychological profiling.

Required structure inside summary:
"What you’re carrying:"
"What’s really happening:"
${input.plan === "PREMIUM" ? '"Deeper direction:"' : ""}

gentle_next_step must include:
Option A:
Option B:
${input.plan === "PREMIUM" ? 'Script line:' : ""}

Return VALID JSON ONLY.
`.trim();

  const user = `
User plan: ${input.plan}

${memoryBlock}

ANCHORS (use at least ONE verbatim):
${anchorsBlock}

Create a Havenly reflection:

${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1050 : 650;

  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(),30000);

  async function callGroq(temperature:number, system:string){
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      signal:controller.signal,
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${apiKey}`
      },
      body:JSON.stringify({
        model,
        temperature,
        max_tokens,
        messages:[
          {role:"system",content:system},
          {role:"user",content:user}
        ]
      })
    });

    if(!res.ok){
      const text = await res.text().catch(()=> "");
      throw new Error(`Groq request failed (${res.status}): ${text}`);
    }

    const data:any = await res.json();
    return String(data?.choices?.[0]?.message?.content ?? "");
  }

  function reflectionText(r:any){
    return [
      cleanString(r?.summary),
      cleanString(r?.core_pattern),
      cleanString(r?.gentle_next_step),
      ...(Array.isArray(r?.questions)? r.questions.map(String):[])
    ].join("\n");
  }

  try{

    const raw1 = await callGroq(input.plan==="PREMIUM"?0.55:0.4, systemBase);
    const parsed1 = parseModelJson<any>(raw1);

    if(parsed1){
      const text = reflectionText(parsed1);
      if(containsAny(text,anchors)){
        return normalizeReflection(parsed1);
      }
    }

    const raw2 = await callGroq(0.2, systemBase + "\nSTRICT RETRY: Include an ANCHOR.");
    const parsed2 = parseModelJson<any>(raw2);

    if(parsed2){
      const text = reflectionText(parsed2);
      if(containsAny(text,anchors)){
        return normalizeReflection(parsed2);
      }
    }

    const fallbackAnchor = anchors[0];

    return normalizeReflection({
      summary:
        input.plan==="PREMIUM"
        ? `What you’re carrying: You’re tired of trying and still feeling “not enough”.\nWhat’s really happening: ${fallbackAnchor}.\nDeeper direction: You’re being pulled toward clearer needs and boundaries.`
        : `What you’re carrying: You’re tired of trying and still feeling “not enough”.\nWhat’s really happening: ${fallbackAnchor}.`,
      core_pattern:"You’re trying to be understood through effort but need clearer agreement on what effort means.",
      themes:["clarity","needs"],
      emotions:["confusion","frustration"],
      gentle_next_step:
        input.plan==="PREMIUM"
        ? "Option A: Ask what appreciation looks like for them. Option B: Name what appreciation means to you. Script line: “I care about you, and I want to understand what effort means to you so I stop guessing.”"
        : "Option A: Write one sentence about what you hoped your effort meant. Option B: Ask yourself what you need to feel appreciated.",
      questions:[
        "What do you most want your effort to communicate?",
        "What is your minimum standard for appreciation?",
        "What would you stop doing if protecting your self-respect?",
        "Next time, paste the exact sentence that stung and what you did right after."
      ]
    });

  }finally{
    clearTimeout(timeout);
  }
}
