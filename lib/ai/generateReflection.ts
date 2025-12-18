// lib/ai/generateReflection.ts

type ReflectionResult = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

/**
 * IMPORTANT DESIGN GUARANTEE
 * - Reflections MUST be grounded in the user's actual words
 * - No generic filler or coaching templates
 * - If content is insufficient, the model must say so explicitly
 */
export async function generateReflectionFromEntry({
  title,
  content,
}: {
  title?: string;
  content: string;
}): Promise<ReflectionResult> {
  const trimmed = content.trim();

  if (trimmed.length < 20) {
    return {
      summary:
        "This entry is very brief, making it hard to reflect meaningfully yet.",
      themes: [],
      emotions: [],
      gentle_next_step:
        "You might try writing a few more sentences about what prompted this entry.",
      questions: [
        "What was happening when you decided to write this?",
        "What feels unfinished or unsaid here?",
      ],
    };
  }

  /**
   * SYSTEM PROMPT — DO NOT SOFTEN
   */
  const systemPrompt = `
You are a reflective journaling assistant.

Rules you MUST follow:
- Only use information explicitly present in the journal entry.
- Do NOT invent emotions, events, or intentions.
- Avoid generic therapeutic language.
- Be concrete, specific, and grounded.
- If unsure, say so explicitly.

You must return a JSON object with:
summary: 1–2 sentences summarizing what the user actually wrote.
themes: 2–4 concise themes derived from the text.
emotions: emotions explicitly expressed or strongly implied.
gentle_next_step: a realistic, grounded next step connected to the entry.
questions: 2 thoughtful questions directly tied to the content.
`;

  const userPrompt = `
Journal title: ${title ?? "(untitled)"}

Journal entry:
"""
${trimmed}
"""
`;

  // 🔌 Replace this with your actual LLM call
  const responseText = await callLLM({
    system: systemPrompt,
    user: userPrompt,
  });

  let parsed: ReflectionResult;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("AI reflection returned invalid JSON");
  }

  return {
    summary: parsed.summary,
    themes: Array.isArray(parsed.themes) ? parsed.themes : [],
    emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
    gentle_next_step: parsed.gentle_next_step,
    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
  };
}

/**
 * Stub — wire to OpenAI, Groq, etc.
 */
async function callLLM({
  system,
  user,
}: {
  system: string;
  user: string;
}): Promise<string> {
  throw new Error(
    "callLLM() not implemented. Connect your LLM provider here."
  );
}
