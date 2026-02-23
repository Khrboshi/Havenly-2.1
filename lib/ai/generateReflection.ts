// lib/ai/generateReflection.ts
// MindScribe V6 — "The Insight Engine" (High-Value Analysis)
// Groq (OpenAI-compatible): https://api.groq.com/openai/v1/chat/completions

export type Reflection = {
  summary: string;
  core_pattern?: string; // optional so UI never crashes if missing
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
          "What is one small thing you actually need right now?",
          "How would you treat a friend in this exact situation?",
        ];

  return {
    summary:
      summary ||
      "We hear you. Try adding a bit more detail so we can find the deeper pattern.",
    core_pattern: corePattern || undefined,
    themes: themes.length ? themes : ["reflection"],
    emotions: emotions.length ? emotions : ["neutral"],
    gentle_next_step:
      nextStep ||
      "Take a deep breath and acknowledge that your feelings make sense.",
    questions,
  };
}

export async function generateReflectionFromEntry(
  input: Input
): Promise<Reflection> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  // Premium users need the smartest model capability
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const titleLine = input.title?.trim() ? `Title: ${input.title.trim()}\n` : "";
  const entryText = `${titleLine}Entry:\n${(input.content || "").trim()}`;

  // V6 PROMPT: FOCUS ON "SYNTHESIS" NOT "SUMMARY"
  const system = `
You are MindScribe, an advanced psychological companion designed to help users find clarity.

YOUR MISSION:
The user is paying for *insight*, not just a summary. 
Do not just repeat what happened. Tell them *why* it matters.
Connect the dots between their actions and their feelings.

CRITICAL RULES FOR ANALYSIS:
1. DETECT THE IRONY: Look for mismatches (e.g., "I gave safety, she saw risk"). Point this out gently.
2. VALIDATE THE EFFORT: Explicitly mention the specific hard thing they did (e.g., "driving at night").
3. NO CLICHES: Do not say "Communication is key." Say "You are speaking 'Safety' and she is hearing 'Control'."
4. TONE: Deep, calm, and highly perceptive. Like a wise mentor.

Output MUST be valid JSON only.

Return EXACTLY this schema:
{
  "summary": "3-4 sentences. Validate the specific action they took. Then, pivot to the underlying emotional disconnect. Use the phrase 'It makes sense that you feel...' at least once.",
  "core_pattern": "One powerhouse sentence that names the 'Root Cause' of the tension. make it insightful.",
  "themes": ["3–6 punchy themes"],
  "emotions": ["3–6 nuanced emotions"],
  "gentle_next_step": "A psychological shifting task (e.g., 'Notice when you feel...', not just 'Write a list').",
  "questions": ["2–4 deep questions that force a new perspective, not just open-ended ones."]
}
`.trim();

  const user = `
User plan: ${input.plan}

Analyze this entry:
${entryText}
`.trim();

  const max_tokens = input.plan === "PREMIUM" ? 1100 : 700;

  const controller = new AbortController();
  const timeoutMs = 35_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
        // Higher temperature for more "human" insight, less robotic summary
        temperature: 0.7, 
        max_tokens,
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
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    
    // Safety cleaner if model adds markdown blocks
    const cleanRaw = raw.replace(/```json/g, "").replace(/```/g, "");

    const parsed = safeJsonParse<any>(cleanRaw);
    if (!parsed) {
      throw new Error(`Model returned non-JSON output.`);
    }

    return normalizeReflection(parsed);
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Analysis timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
