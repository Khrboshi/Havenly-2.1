export type BlogArticle = {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  summary: string;
  body: string[];
};

export const ARTICLES: BlogArticle[] = [
  {
    slug: "when-you-feel-behind-on-your-own-life",
    category: "Emotional load",
    minutes: 5,
    title: "When you feel behind on your own life",
    summary:
      "How to notice the quiet pressure you put on yourself, and what gentle pacing can look like in real days.",
    body: [
      "Feeling “behind” is rarely about your calendar. It’s usually about the quiet, invisible pressure you carry: the life you thought you’d have by now, the expectations you’ve picked up from other people, the pace you believe you should be keeping.",
      "On overloaded weeks, your brain starts measuring everything against an imaginary version of you who is always caught up. No inbox backlog. No emotional backlog. No fatigue.",
      "Havenly can’t fix your schedule, but it can help you see what’s actually happening underneath it. When you write honestly about your days, patterns emerge: which responsibilities drain you most, which small moments feel unexpectedly grounding, which expectations never belonged to you in the first place.",
      "Why it matters: when you see that you’re not 'behind'—you’re overloaded—it becomes easier to soften the internal narrative. You can start asking kinder questions: What can be lighter? What can be good enough for now? Where do I need to lower the bar so I can actually rest?"
    ]
  },
  {
    slug: "tiny-check-ins-for-a-very-busy-brain",
    category: "Journaling",
    minutes: 4,
    title: "Tiny check-ins for a very busy brain",
    summary:
      "You don’t need a perfect journaling habit. A few honest sentences are enough for patterns to emerge.",
    body: [
      "If journaling has never stuck for you, it’s probably not because you lack discipline. It’s because most versions of journaling were designed for spacious evenings, perfect routines, and blank notebooks that stay tidy.",
      "Real life is noisier. Your attention is fragmented. When you finally have five minutes to yourself, it rarely feels like the 'right' time to sit and write.",
      "Tiny check-ins change the rules. Instead of a full-page entry, you tell the truth about one moment: what actually happened, what it felt like in your body, what you needed but didn’t get.",
      "Over time, those small, honest snapshots give Havenly enough to reflect back to you: not as criticism, but as gentle patterns. You see what keeps coming up. You see where you’re consistently doing your best in hard conditions.",
      "Why it matters: consistency becomes less about willpower and more about friendliness. A busy brain can still have a steady inner conversation—just a few sentences at a time."
    ]
  },
  {
    slug: "difference-between-distraction-and-rest",
    category: "Rest",
    minutes: 6,
    title: "The difference between distraction and real rest",
    summary:
      "Scrolling isn’t failure. But your body can feel the difference between numbing out and actually exhaling.",
    body: [
      "Distraction has a bad reputation, but most of us reach for it because we’re tired. Our brains are asking for relief, and the fastest relief is whatever helps us not feel so much all at once.",
      "The problem isn’t that you scroll or binge or zone out. The problem is that distraction doesn’t give your nervous system what it actually needs to recover.",
      "Real rest is quieter and less glamorous. It looks like boredom, slower breathing, stretches of time where nothing is demanding a reaction from you.",
      "Havenly helps by turning your evenings into data you can feel. When you write about how you actually spent your downtime—what you watched, how you felt before and after—patterns start to show up. Which habits leave you more grounded? Which ones leave your body buzzing but still exhausted?",
      "Why it matters: when you can see the difference between numbing and exhaling, you can choose rest without shaming yourself for the nights that were just survival."
    ]
  },
  {
    slug: "emotional-backlog-why-you-feel-so-tired",
    category: "Self-awareness",
    minutes: 7,
    title: "Emotional backlog: why you feel so tired",
    summary:
      "Your exhaustion often has less to do with tasks, and more to do with feelings that never got to land.",
    body: [
      "There’s a kind of tiredness that sleep doesn’t touch. You wake up with a full battery physically, but a low battery emotionally. Everything feels heavier than it ‘should’.",
      "Often, that’s emotional backlog—moments you lived through but never had space to process. Conversations you replay. Decisions you postponed. Relief you never fully felt.",
      "When you pour a little of that backlog into Havenly, it stops living entirely in your head. You give those experiences a place to land.",
      "Premium’s timelines can then highlight when the backlog spikes: after certain meetings, seasons, or relational patterns. That visibility isn’t about blaming yourself; it’s about understanding why your system is so tired.",
      "Why it matters: when exhaustion makes sense, it becomes easier to be kind to yourself—and to choose rest that meets the real need, not the imagined one."
    ]
  }
];

export function getArticle(slug: string): BlogArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
