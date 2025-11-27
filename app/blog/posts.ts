// app/blog/posts.ts

export type BlogSection = {
  heading?: string;
  body: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
  intro: string;
  sections: BlogSection[];
  takeaway: string;
};

export const posts: BlogPost[] = [
  {
    slug: "why-gentle-journaling-works",
    title: "Why gentle journaling works (even if you only write for 5 minutes)",
    subtitle:
      "You don’t need a perfect routine or deep insights to benefit from journaling. A few honest sentences can already change how you feel.",
    description:
      "Most people imagine journaling as a big daily habit. Gentle journaling takes a softer approach: tiny check-ins that fit into real life.",
    category: "Havenly Journal",
    date: "Jan 1, 2025",
    readTime: "5 min read",
    featured: true,
    intro:
      "Most people think journaling has to be a big habit: long entries, perfect routines, a special notebook, the right mood. In reality, the kind of journaling that helps the most is usually much smaller and much gentler.",
    sections: [
      {
        heading: "1. Naming a feeling reduces its weight",
        body: [
          "When something feels heavy, confusing, or scattered, your mind is usually trying to hold too many things at once. Writing a few lines forces your thoughts into a clearer shape.",
          "Psychologists sometimes call this 'labeling'. When you put a feeling into words, your brain treats it more like information and less like a threat. Activity in the emotional centers of the brain goes down, and the part that helps you reason turns up.",
        ],
        list: [
          "“I am anxious about tomorrow’s meeting.”",
          "“I feel strangely flat today, even though nothing is wrong.”",
          "“I am tired of pretending everything is fine.”",
        ],
      },
      {
        heading: "2. Small check-ins are more sustainable than big breakthroughs",
        body: [
          "It is easy to promise yourself a big new habit: “From now on I will journal every morning for 30 minutes.” It feels impressive, but life does not always cooperate.",
          "Gentle journaling takes a different approach: it assumes you are already busy, already tired, and already carrying a lot. So it asks for less — and ends up giving you more.",
        ],
        list: [
          "A few minutes instead of a long session.",
          "A handful of sentences instead of a perfect essay.",
          "“How am I, really?” instead of a big life plan.",
        ],
      },
      {
        heading: "3. You can be honest on paper in a way that is difficult out loud",
        body: [
          "There are things we cannot easily say to friends, colleagues, or even the people we love most. Not because they are bad people, but because we are protecting them, or protecting ourselves.",
          "On the page, it is often easier to be honest without interruption or judgment. Your journal does not ask follow-up questions. It simply holds what you wrote.",
        ],
        list: [
          "“I am scared to admit this to anyone, but…”",
          "“Part of me wants to leave, and part of me wants to stay.”",
          "“I do not know what I want — and that is uncomfortable.”",
        ],
      },
      {
        heading: "4. A gentle summary helps you notice what really mattered",
        body: [
          "This is where Havenly’s AI comes in. After you write, the AI is not there to judge, optimise, or tell you what to do. Its job is only to reflect back what it heard in a kind and simple way.",
          "Sometimes reading a sentence like that helps you see your own words with fresh eyes. The story becomes a little clearer. You might realise, “Yes, that is exactly what hurts,” or, “I did not realise how proud I actually am of myself.”",
        ],
      },
      {
        heading: "5. Your future self will be grateful you wrote it down",
        body: [
          "On the days when everything feels too much, it is easy to think, “Nothing is changing. I am always like this.” Looking back at old reflections gently proves otherwise.",
          "Your journal becomes quiet evidence that you are moving, learning, and surviving difficult things — even when that is hard to feel in the moment.",
        ],
        list: [
          "Fears that felt huge at the time but slowly softened.",
          "Patterns that repeat when you are tired or overwhelmed.",
          "Small things that helped more than you expected.",
        ],
      },
    ],
    takeaway:
      "Gentle journaling works not because it is dramatic, but because it is honest, small, and repeated. You deserve a place where you can be that honest with yourself.",
  },
  {
    slug: "the-3-minute-journal-that-actually-works",
    title: "The 3-minute journal that actually works (even on busy days)",
    subtitle:
      "You do not need a morning routine or a special notebook. You need one small ritual you can actually keep.",
    description:
      "A simple 3-minute template you can reuse inside Havenly whenever life feels crowded but you still want to check in.",
    category: "Tiny Rituals",
    date: "Jan 8, 2025",
    readTime: "4 min read",
    intro:
      "Most people give up on journaling because the version they imagine does not fit real life. The pages are too long, the expectations are too high, and missing one day feels like failure. A 3-minute journal is designed for the opposite: it assumes you are tired, distracted, and short on time — and still deserves a moment of honesty.",
    sections: [
      {
        heading: "1. Why 3 minutes is enough",
        body: [
          "In cognitive psychology, small ‘micro-behaviours’ are more likely to become habits than large, effortful routines. Once a behaviour fits into the tiny gaps of the day, your brain stops arguing with it.",
          "Three minutes is short enough that you can start even when you do not feel like it. It is also long enough to slow down your breathing, gather your thoughts, and write a few honest sentences.",
        ],
      },
      {
        heading: "2. A simple template you can reuse every day",
        body: [
          "Inside Havenly, you can paste or adapt this structure whenever you open your journal. Think of it as a soft scaffold — something that holds you up without being rigid.",
        ],
        list: [
          "Today I notice I am feeling…",
          "One thing that is quietly weighing on me is…",
          "One small thing I am grateful for, or proud of, is…",
          "Tonight, I would like to be a little kinder to myself by…",
        ],
      },
      {
        heading: "3. Pair it with a trigger you already have",
        body: [
          "Habits stick when they are attached to something that already happens. Psychologists call this 'implementation intention': “After X, I will do Y.”",
          "Choose one tiny moment that already exists in your day and quietly attach journaling to it:",
        ],
        list: [
          "After I close my laptop for the day, I will write for 3 minutes.",
          "After I make my evening tea, I will open Havenly.",
          "After I get into bed, I will write one honest paragraph before scrolling.",
        ],
      },
      {
        heading: "4. Let Havenly’s AI handle the heavy lifting",
        body: [
          "Once you have written your three minutes, you do not need to analyse it all yourself. Ask the AI for a gentle summary, or a kind reflection. Its job is to highlight what seemed important, not to criticise.",
          "Over time, those summaries become a soft mirror of your inner life — patterns of stress, pockets of gratitude, and recurring themes you might otherwise miss.",
        ],
      },
    ],
    takeaway:
      "If you only have three minutes, that is enough. Use a tiny structure, pair it with a daily trigger, and let Havenly hold the bigger picture for you.",
  },
  {
    slug: "why-your-mind-feels-lighter-after-two-sentences",
    title: "Why your mind feels lighter after writing just 2 sentences",
    subtitle:
      "There is a scientific reason you feel a little clearer after getting something out of your head and onto the page.",
    description:
      "A look at how ‘mental load’ works, and why even a few lines of writing can free up space in your mind.",
    category: "Mind Science",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    intro:
      "You have probably felt it before: you type two honest sentences into Havenly and, somehow, your chest feels a little less tight. The situation has not changed — but your mind has. This is not magic; it is how your brain handles unspoken thoughts.",
    sections: [
      {
        heading: "1. Your brain treats unspoken worries as unfinished tasks",
        body: [
          "Cognitive scientists describe something called the 'Zeigarnik effect': our minds hold on more tightly to unfinished tasks than completed ones.",
          "When a worry stays only in your head, your brain treats it like an open loop. The moment you write it down, the loop feels a little more closed — not because the problem is solved, but because it finally has a place to live.",
        ],
      },
      {
        heading: "2. Writing slows your thoughts to the speed of your hand",
        body: [
          "Anxious thinking is fast, repetitive, and hard to catch. Writing is slower by design. You cannot type as quickly as you can worry.",
          "That slower pace forces your thoughts into a line: one sentence, then the next. The chaos becomes a sequence. Your nervous system often responds by lowering the volume just a little.",
        ],
      },
      {
        heading: "3. Two sentences are enough to start a new story",
        body: [
          "You do not need a full essay. Often, these two lines are enough to feel lighter:",
        ],
        list: [
          "“Right now I am most worried about…”",
          "“If I am honest, what I need most is…”",
        ],
      },
      {
        heading: "4. Havenly’s reflections help you see what you already knew",
        body: [
          "When you ask Havenly’s AI for a reflection, it is not inventing new truths about you. It is simply highlighting what you already said, in slightly clearer language.",
          "Sometimes all you need is one sentence back — “This feels heavy and you are still carrying it with care” — to feel less alone with what you are holding.",
        ],
      },
    ],
    takeaway:
      "If your mind feels crowded, try two honest sentences. You can always write more, but you do not have to. Even a tiny expression gives your brain permission to rest.",
  },
  {
    slug: "how-to-talk-to-yourself-more-kindly",
    title: "How to talk to yourself more kindly (backed by psychology)",
    subtitle:
      "Self-criticism feels like motivation, but often it quietly drains your energy. A kinder inner voice helps you keep going.",
    description:
      "Practical ways to shift your self-talk from harsh to supportive — without pretending everything is fine.",
    category: "Self-Kindness",
    date: "Jan 22, 2025",
    readTime: "6 min read",
    intro:
      "Many of us learned to push ourselves with a sharp inner voice: “You should be doing more. This isn’t good enough. Other people cope better.” It can feel like the only way to stay on track. But research in self-compassion shows the opposite: people who speak to themselves more kindly are actually more resilient, not less.",
    sections: [
      {
        heading: "1. Harsh self-talk keeps your nervous system on alert",
        body: [
          "Your brain does not fully distinguish between external criticism and internal criticism. When your inner voice is harsh, your body often responds as if someone else in the room is disappointed with you.",
          "That ongoing tension can make it harder to think clearly, sleep deeply, or recover after stress.",
        ],
      },
      {
        heading: "2. Self-compassion is not pretending everything is fine",
        body: [
          "Psychologist Kristin Neff describes self-compassion as treating yourself the way you would treat a good friend: honest, but gentle.",
          "Kind self-talk does not ignore problems. It simply leaves out the part where you attack yourself for having them.",
        ],
        list: [
          "Harsh: “You messed this up again. What is wrong with you?”",
          "Kind: “This was hard, and you wish it had gone differently. What might help next time?”",
        ],
      },
      {
        heading: "3. Use journaling to practise a different voice",
        body: [
          "Inside Havenly, try writing in two columns: what your critical voice says, and what a kinder, wiser friend might say back.",
        ],
        list: [
          "Column A — “Inner critic”: all the sharp thoughts, without censoring.",
          "Column B — “Inner ally”: one calm, realistic response to each line.",
        ],
      },
      {
        heading: "4. Let the AI model a gentler tone for you",
        body: [
          "If it feels difficult to generate kind responses at first, you can ask Havenly’s AI to help. Paste a paragraph of your self-talk and say:",
          "“Can you respond to this the way a supportive friend or therapist might, without minimising the difficulty?”",
          "Reading those responses regularly trains your brain to recognise a kinder tone as familiar, not suspicious.",
        ],
      },
    ],
    takeaway:
      "You do not have to earn a kind inner voice. You are allowed to speak to yourself the way you would speak to someone you love who is doing their best in a hard season.",
  },
];

export function getSortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => {
    // Dates are strings like "Jan 1, 2025" – fall back to original order if parsing fails
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
    return bTime - aTime;
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
