import Groq from "groq-sdk";

type ReflectionInput = {
  content: string;
  title?: string;
  plan: "FREE" | "PREMIUM";
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generateReflectionFromEntry({
  content,
  title,
  plan,
}: ReflectionInput) {
  const depthInstruction =
    plan === "PREMIUM"
      ? `
Go deeper. Read between the lines.
Name underlying tensions, values, or conflicts.
Make the reflection feel personal and specific.
`
      : `
Keep it gentle, supportive, and concise.
Avoid therapy or diagnostic language.
`;

  const prompt = `
You are a calm, emotionally intelligent reflection partner.

This is NOT therapy.
Do NOT diagnose.
Do NOT give advice unless invited.

Your role is to reflect what the writer may not yet see.

${depthInstruction}

Journal title:
"${title || "Untitled"}"

Journal entry:
"""
${content}
"""

Return a JSON object with this exact structure:

{
  "summary": "2–3 sentences capturing the emotional core",
  "themes": ["3–5 emotionally meaningful themes"],
  "emotions": ["3–5 nuanced emotions"],
  "gentle_next_step": "One small, realistic step for today",
  "questions": [
    "A question that invites insight",
    "A question that invites self-compassion",
    "A question that explores direction or meaning"
  ]
}

Avoid generic phrases.
Do not repeat the journal text.
Sound like a thoughtful human who truly read this.
`;

  const completion = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: plan === "PREMIUM" ? 0.8 : 0.6,
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("Empty response from Groq");
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse reflection JSON:", raw);
    throw new Error("Invalid reflection format returned");
  }
}
