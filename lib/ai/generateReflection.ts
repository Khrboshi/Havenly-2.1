// lib/ai/generateReflection.ts

type ReflectionResult = {
  summary: string;
  themes: string[];
  emotions: string[];
  gentle_next_step: string;
  questions: string[];
};

export async function generateReflectionFromEntry({
  title,
  content,
}: {
  title?: string;
  content: string;
}): Promise<ReflectionResult> {
  /**
   * NOTE:
   * This is a deterministic, safe placeholder.
   * It allows the credit system + API flow to be validated first.
   * We will wire the real LLM AFTER credits are proven correct.
   */

  const trimmed = content.trim();

  return {
    summary:
      trimmed.length > 0
        ? `This reflection highlights what stood out most in your entry${
            title ? ` titled “${title}”.` : "."
          }`
        : "This entry reflects a moment of quiet presence.",

    themes: ["Self-awareness", "Emotional processing"],

    emotions: ["Curiosity", "Reflection"],

    gentle_next_step:
      "Consider noticing one small moment today where you felt slightly more grounded.",

    questions: [
      "What felt most important to express here?",
      "What do you want to carry forward from this moment?",
    ],
  };
}
