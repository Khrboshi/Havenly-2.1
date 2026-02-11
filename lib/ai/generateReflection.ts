// lib/ai/generateReflection.ts
// Groq (OpenAI-compatible) reflection generator
// Uses: https://api.groq.com/openai/v1/chat/completions

export type Reflection = {
  summary: string;
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

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Try to extract JSON if model wrapped it in text
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function uniqTrimLower(list: unknown[], max: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of list) {
    const s = String(v ?? "").trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

function normalizeReflection(r: any, plan: Input["plan"]): Reflection {
  const summary = typeof r?.summary === "string" ? r.summary.trim() : "";
  const themes = Array.isArray(r?.themes) ? uniqTrimLower(r.themes, plan === "PREMIUM" ? 7 : 5) : [];
  const emotions = Array.isArray(r?.emotions)
    ? uniqTrimLower(r.emotions, plan === "PREMIUM" ? 7 : 5)
    : [];
  const gentle_next_step =
    typeof r?.gentle_next_step === "string" ? r.gentle_next_step.trim() : "";
  const questions = Array.isArray(r?.questions)
    ? uniqTrimLower(r.questions, plan === "PREMIUM" ? 4 : 2)
    : [];

  return {
    summary: summary || "A reflective summary could not be generated.",
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      gentle_next_step ||
      "Take 2 minutes to write one honest sentence about what you need most right now.",
    questions: questions.length
      ? questions
      : ["What is the smallest next step that would make today feel 1% better?"],
  };
}

function sanitizeEntryText(s: string, maxLen: number): string {
  const trimmed = (s || "").trim();
  if (trimmed.length <= maxLen) return trimmed;
  // Keep the beginning and end (often contains conclusion/feelings)
  const head = trimmed.slice(0, Math.floor(maxLen * 0.7));
  const tail = trimmed.slice(-Math.floor(maxLen * 0.3));
  return `${head}\n...\n${tail}`;
}

function buildSystemPrompt(plan: Input["plan"]): string {
  // The plan affects depth & verbosity (without changing schema)
  const depth = plan === "PREMIUM"
    ? `
Depth mode (PREMIUM):
- Go beyond paraphrase: infer likely underlying needs/values, and name the core tension.
- Use emotionally nuanced language without dramatizing.
- Questions should be penetrating and specific (not generic self-help).`
    : `
Depth mode (FREE):
- Be concise and specific.
- Avoid long analysis; focus on the clearest tension and a practical next step.
- Questions should be targeted and simple.`;

  return `
You are Havenly, a careful reflective journaling assistant.

Your job is NOT to give pep-talk advice. Your job is to mirror what matters, name patterns, and offer a gentle next step.

Non-negotiable rules:
- Do NOT diagnose or mention disorders.
- Do NOT mention therapy unless the user explicitly asks.
- Avoid generic wellness clichés (e.g., "practice self-care", "be mindful") unless you make them concrete and tied to the entry.
- Do not repeat the user's wording verbatim for more than a short phrase; paraphrase and add insight.
- Identify at least one hidden tension/contradiction (e.g., "doing well on paper vs feeling empty").
- Be warm, grounded, and psychologically insightful without sounding clinical.
- Prefer nuance over certainty. Use "it seems / it might / it could be" when inferring.

Output constraints:
- Output MUST be valid JSON ONLY.
- No markdown, no extra text, no trailing commentary.

Return JSON schema EXACTLY:
{
  "summary": "2-5 sentences. Mirror key tensions + what's most important beneath the surface.",
  "themes": ["short concrete themes"],
  "emotions": ["nuanced but plain emotions"],
  "gentle_next_step": "One small action in <10 minutes that starts today, extremely specific and realistic",
  "questions": ["targeted questions that unlock insight"]
}

Formatting guidance:
- themes/emotions: single words or short phrases (no long sentences).
- gentle_next_step: ONE action (not a list). Make it doable today.
- questions: avoid yes/no; make them anchored to the user's situation.

${depth}
`.trim();
}

function buildUserPrompt(input: Input, entryText: string): string {
  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  return `
User plan: ${input.plan}
Write a reflection for this journal entry.

${titleLine}Entry:
${entryText}

Reminder: Return JSON only, matching the exact schema.
`.trim();
}

export async function generateReflectionFromEntry(input: Input): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  // ✅ Use a currently supported Groq model.
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  // Keep payload reasonable and reduce token waste
  const entryText = sanitizeEntryText(input.content, input.plan === "PREMIUM" ? 14000 : 9000);

  const system = buildSystemPrompt(input.plan);
  const user = buildUserPrompt(input, entryText);

  // Token budget tuned by plan
  const max_tokens = input.plan === "PREMIUM" ? 900 : 520;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: input.plan === "PREMIUM" ? 0.6 : 0.5,
      max_tokens, // ✅ correct field for Groq chat completions
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${text}`);
  }

  const data: any = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";

  const parsed = safeJsonParse<any>(content);
  if (!parsed) {
    throw new Error(`Model returned non-JSON output: ${content.slice(0, 400)}`);
  }

  return normalizeReflection(parsed, input.plan);
}
