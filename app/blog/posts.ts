// app/blog/posts.ts

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-your-mind-feels-heavy",
    title: "Why your mind feels so heavy on quiet days",
    description:
      "Quiet moments make the emotional load louder. Here's why that heaviness shows up — and what it really means.",
    readingTime: "3 min read",
    content: `
On quiet days, when life slows down, your thoughts get louder. The heaviness you feel isn’t a flaw — it’s the emotional backlog that finally has space to surface.

Your nervous system can power through noise and responsibility, but silence shows you what you’ve been carrying. This is not weakness. It’s honesty.

Quiet heaviness is your mind asking for space, gentleness, and truth.

**Why it matters:**  
When you see heaviness as accumulated emotional load instead of failure, you respond with compassion, not pressure.
    `,
  },
  {
    slug: "you-are-not-behind",
    title: "You’re not behind — you’re exhausted",
    description:
      "Most people who feel 'behind' are carrying exhaustion, not failure. Here's how to recognize the difference.",
    readingTime: "3 min read",
    content: `
People often believe they’re “behind,” but the truth is simpler: they’re exhausted emotionally, mentally, or physically.

Functioning through exhaustion doesn’t mean you're okay. It means you’ve adapted to running on empty.

You don’t need to push harder. You need rest without guilt.

**Why it matters:**  
Seeing exhaustion for what it is changes your self-talk from judgment to gentleness.
    `,
  },
  {
    slug: "talk-to-yourself-when-unworthy",
    title: "How to talk to yourself on the days you feel unworthy",
    description:
      "Unworthiness isn’t truth — it’s overwhelm. Here’s a softer way to speak to yourself when it happens.",
    readingTime: "4 min read",
    content: `
Feeling unworthy means your emotional bandwidth is low, not that something is wrong with you.

A gentle inner voice can shift your entire state:

“I’m having a hard moment. It’s okay. I don’t have to fix everything right now.”

Softness calms the body.

**Why it matters:**  
Self-compassion is emotional regulation. It helps you breathe again when the mind spirals.
    `,
  },
  {
    slug: "small-emotional-wins",
    title: "Small emotional wins count more than big breakthroughs",
    description:
      "Healing often looks like tiny honest choices — and they matter more than dramatic breakthroughs.",
    readingTime: "3 min read",
    content: `
Healing rarely happens in dramatic moments. It comes through tiny choices: rest, truth, boundaries, reaching out.

Small emotional wins accumulate quietly — and suddenly life feels lighter.

**Why it matters:**  
The brain underrates small wins, but they create real emotional resilience.
    `,
  },
  {
    slug: "burnout-and-simple-tasks",
    title: "Why burnout makes simple tasks feel impossible",
    description:
      "Your brain isn’t broken — it’s conserving energy. Here’s why burnout shrinks your capacity.",
    readingTime: "4 min read",
    content: `
Burnout isn't failure — it's protection.  
Your system slows down to conserve energy, making tiny tasks feel huge.

Instead of pushing, go slower: one simple step, one honest sentence.

**Why it matters:**  
Understanding burnout removes shame and opens the door to kinder pacing.
    `,
  },
  {
    slug: "healing-power-of-naming-feelings",
    title: "The healing power of naming your feelings",
    description:
      "Naming emotions is one of the simplest tools for clarity and emotional peace. Here’s why it works.",
    readingTime: "3 min read",
    content: `
Naming feelings doesn’t fix them — but it brings clarity to the storm.

Many people were never taught how to name emotions. But once you do, things untangle.

**Why it matters:**  
Naming is the first step toward understanding what your mind and body need.
    `,
  },
];
