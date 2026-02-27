// lib/ai/generateReflection.ts
// MindScribe V12 — Premium Structure with Engineering Safety (Merged V11.4 + V7)

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

// --- UTILITIES & SAFETY ---

function isFitnessText(s: string): boolean {
  const t = (s || "").toLowerCase();
  return (
    /\bran\b/.test(t) || /\brun\b/.test(t) || /\brunning\b/.test(t) ||
    /\bworkout\b/.test(t) || /\btraining\b/.test(t) || /\bexercise\b/.test(t) ||
    /\bgym\b/.test(t) || /\blift\b/.test(t) || /\brecovery\b/.test(t) ||
    /\brest\b/.test(t) || /\bsleep\b/.test(t) || /\b(\d+)\s*km\b/.test(t)
  );
}

function detectDomain(t: string): Domain {
  const s = (t || "").toLowerCase();
  const fitness = isFitnessText(s);
  const work = /colleague|coworker|manager|team|meeting|work|office|client|boss/.test(s);
  const rel = /partner|wife|husband|girlfriend|boyfriend|relationship|love|date|argue|fight|gift/.test(s);

  if (fitness && !work && !rel) return "FITNESS";
  if (work && !fitness && !rel) return "WORK";
  if (rel && !fitness && !work) return "RELATIONSHIP";
  return "GENERAL";
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

function parseModelJson<T>(raw: string): T | null {
  const cleaned = normalizeQuotes(raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim());
  const direct = safeJsonParse<T>(cleaned);
  if (direct) return direct;
  
  // Try finding json object if text surrounds it
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) return safeJsonParse<T>(cleaned.slice(start, end + 1));
  return null;
}

function cleanString(v: unknown): string { return typeof v === "string" ? v.trim() : ""; }

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
  return (s || "").toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N}\s'’-]/gu, "").trim();
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

// Ensure we always return 4 high-quality questions
function ensureFourQuestions(qs: string[], domain: Domain): string[] {
  const cleaned = qs.map((s) => String(s || "").trim()).filter(Boolean);
  
  const defaults = domain === "FITNESS" 
    ? [
        "What did you prove to yourself by showing up today?",
        "What would “healthy discipline” look like this week?",
        "What is one recovery signal your body is giving you?",
        "Next time, paste your exact self-talk after the workout.",
      ]
    : [
        "What is the cleanest interpretation that respects your feelings?",
        "What boundary would protect you without escalating?",
        "How would you treat a friend in this exact situation?",
        "Next time, paste the exact words that stung you the most.",
      ];

  const out = cleaned.slice(0, 4);
  while (out.length < 4) out.push(defaults[out.length]);
  return out.slice(0, 4);
}

function normalizeReflection(r: any, domain: Domain): Reflection {
  const summary = cleanString(r?.summary);
  const corePattern = cleanString(r?.core_pattern);
  const themes = cleanStringArray(r?.themes, 6);
  const emotions = cleanStringArray(r?.emotions, 6);
  const nextStep = cleanString(r?.gentle_next_step);
  const questions = ensureFourQuestions(cleanStringArray(r?.questions, 4), domain);

  return {
    summary: summary || "We are listening. Try adding more detail to help us understand.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection", "clarity"],
    emotions: emotions.length ? emotions : ["uncertainty"],
    gentle_next_step: nextStep || "Pause for 60 seconds. Just breathe.",
    questions,
  };
}

function extractAnchors(entry: string): string[] {
  const t = (entry || "").trim();
  const anchors: string[] = [];

  // 1. Look for Quotes first (High Value)
  const quoteMatches = t.match(/[“"][^”"]+[”"]/g) || [];
  for (const q of quoteMatches) {
    const cleaned = q.replace(/^[“"]|[”"]$/g, "").trim();
    if (cleaned.length >= 4 && cleaned.length <= 90) anchors.push(`“${cleaned}”`);
  }

  // 2. Look for Domain specific Signals
  if (/ran\s*5/i.test(t)) anchors.push("you ran 5km today");
  if (/safe|protect/i.test(t)) anchors.push("you were trying to keep them safe");
  if (/brakes|car/i.test(t)) anchors.push("the focus shifted to the car");
  
  // 3. Fallback to sentence fragments
  if (anchors.length < 2) {
    const sentences = t.split(/\n|[.!?]/).map(s => s.trim()).filter(Boolean);
    for (const s of sentences) {
      if (s.length > 10 && s.length < 100) anchors.push(s);
      if (anchors.length >= 3) break;
    }
  }

  return anchors.slice(0, 5);
}

function qualityPass(parsed: any, anchors: string[], plan: "FREE" | "PREMIUM"): boolean {
  if (!parsed) return false;
  const text = JSON.stringify(parsed).toLowerCase();
  
  // Premium Must-Haves
  if (plan === "PREMIUM") {
    if (!text.includes("pattern:")) return false; // Check for our new structure label
    if (!text.includes("dynamic:")) return false;
  }
  
  // Basic Checks
  if (!parsed.summary || parsed.summary.length < 50) return false;
  
  // Valid Anchor Check (Crucial for "Listening")
  // We relax this slightly: if we found anchors, at least ONE should be roughly present
  if (anchors.length > 0) {
    return containsAny(text, anchors);
  }
  
  return true;
}

// --- MAIN AI LOGIC ---
export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const entryBody = (input.content || "").trim();
  const entryText = `Entry:\n${entryBody}`;
  const domain = detectDomain(entryBody);
  const anchors = extractAnchors(entryBody);
  
  // THE NEW "HIGH TICKET" PROMPT
  const systemBase = `
You are MindScribe — a Wise, Structured Analyst.
User Domain: ${domain} (STAY IN THIS DOMAIN).

YOUR GOAL: 
Do not just summarize the entry. Structure the chaos. 
The user pays for CLARITY, not repetition.

STRUCTURE RULES (NON-NEGOTIABLE):
1. **Summary**: Must be exactly 3 parts separated by NEWLINES.
   - "The Situation:" (1 sentence describing the event).
   - "The Dynamic:" (Identify the psychological disconnect, e.g., Safety vs Control).
   - (PREMIUM ONLY) "The Shift:" (One insight on how to view this differently).

2. **Core Pattern**: Do not be vague. Name the specific tension.
   - Bad: "You have communication issues."
   - Good: "You are speaking 'Protection', but they are hearing 'Control'."

3. **Anchors**: You MUST quote the user's exact words (anchors) at least once to prove you listened.
   
TONE:
Deep, calm, professional. 
If the user mentions "Running", treat it as "Training/Discipline".
If the user mentions "Arguments", treat it as "Mismatched Needs".

OUTPUT JSON SCHEMA:
{
  "summary": "The Situation: ...\\n\\nThe Dynamic: ...",
  "core_pattern": "One powerhouse sentence naming the root tension.",
  "themes": ["Theme 1", "Theme 2"],
  "emotions": ["Emotion 1", "Emotion 2"],
  "gentle_next_step": "Option A: ... Option B: ...",
  "questions": ["Question 1", "Question 2", "Question 3", "Next time, ..."]
}
`.trim();

  const user = `
User plan: ${input.plan}
User Anchors (Quote at least one):
${anchors.map(a => `- ${a}`).join("\n")}

Analyze this entry:
${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1100 : 700;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);

  // Helper to call Groq
  async function callGroq(retrySystem?: string) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.5, // Balanced precision/creativity
        max_tokens,
        messages: [{ role: "system", content: retrySystem || systemBase }, { role: "user", content: user }],
      }),
    });
    const data: any = await res.json();
    return String(data?.choices?.[0]?.message?.content ?? "");
  }

  try {
    // Attempt 1
    let raw = await callGroq();
    let parsed = parseModelJson<any>(raw);

    // Attempt 2 (Retry if strict quality fails)
    if (!parsed || !qualityPass(parsed, anchors, input.plan)) {
      const retryPrompt = `${systemBase}\n\nCRITICAL: Your previous response missed the 'The Dynamic:' label or missed key Anchors. Please strictly follow the format.`;
      raw = await callGroq(retryPrompt);
      parsed = parseModelJson<any>(raw);
    }

    // Attempt 3 (Desperate Fallback - looser constraints)
    if (!parsed) {
        // Just try one last time with simple prompt
        raw = await callGroq(`${systemBase}\n\nJust return valid JSON.`);
        parsed = parseModelJson<any>(raw);
    }
    
    // Normalize and Return
    if (!parsed) throw new Error("Failed to generate valid JSON");
    return normalizeReflection(parsed, domain);

  } finally {
    clearTimeout(timeout);
  }
}
