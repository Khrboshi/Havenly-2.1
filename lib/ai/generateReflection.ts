type ReflectionInput = {
  content: string;
  title?: string;
  plan: "FREE" | "PREMIUM";
};

export async function generateReflectionFromEntry({
  content,
  title,
  plan,
}: ReflectionInput) {
  const depthInstruction =
    plan === "PREMIUM"
      ? `
Go deeper. Read between the lines.
Name possible underlying tensions, not just surface feelings.
Offer insights that feel personal and specific.
`
      : `
Keep it gentle, supportive, and concise.
Avoid therapy language.
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
  "summary": "2–3 sentences capturing the emotional core in human language",
  "themes": ["3–5 short themes, emotionally meaningful"],
  "emotions": ["3–5 emotions, nuanced if possible"],
  "gentle_next_step": "One small, realistic step that feels doable today",
  "questions": [
    "A question that invites insight",
    "A question that invites self-compassion",
    "A question that explores direction or meaning"
  ]
}

Avoid generic phrases.
Avoid repeating the journal verbatim.
Sound like a thoughtful human who actually read this.
`;

  // ⚠️ Replace this block with YOUR EXISTING Groq call
  // Example (pseudo):
  //
  // const response = await groq.chat.completions.create({
  //   model: "mixtral-8x7b-32768",
  //   messages: [{ role: "user", content: prompt }],
  // });

  // return JSON.parse(response.choices[0].message.content);

  throw new Error(
    "Replace this throw with your existing Groq completion call"
  );
}
