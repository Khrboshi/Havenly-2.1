export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  minutes: number;
};

export const posts: BlogPost[] = [
  {
    slug: "how-to-talk-to-yourself-more-kindly",
    title: "How to talk to yourself more kindly (backed by psychology)",
    excerpt:
      "Practical ways to shift your self-talk from harsh to supportive — without pretending everything is fine.",
    date: "Jan 22, 2025",
    minutes: 6,
  },
  {
    slug: "why-your-mind-feels-lighter-after-writing",
    title: "Why your mind feels lighter after writing just 2 sentences",
    excerpt:
      "A look at how ‘mental load’ works, and why even a few lines of writing can free up space in your mind.",
    date: "Jan 15, 2025",
    minutes: 5,
  },
  {
    slug: "the-three-minute-journal-that-works",
    title: "The 3-minute journal that actually works (even on busy days)",
    excerpt:
      "A simple 3-minute template you can reuse whenever life feels crowded but you still want to check in.",
    date: "Jan 8, 2025",
    minutes: 4,
  },
  {
    slug: "why-gentle-journaling-works",
    title: "Why gentle journaling works (even if you only write for 5 minutes)",
    excerpt:
      "A softer approach to journaling — no pressure, no perfectionism, no daily streaks.",
    date: "Jan 1, 2025",
    minutes: 5,
  },
];
