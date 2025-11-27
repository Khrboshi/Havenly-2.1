// app/components/blog/MarkdownRenderer.tsx

import type { ReactNode } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split("\n");

  const blocks: ReactNode[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] | null = null;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push(
        <p className="text-slate-200 text-[0.98rem] leading-relaxed mb-4" key={`p-${blocks.length}`}>
          {currentParagraph.join(" ")}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      blocks.push(
        <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-200 text-[0.98rem]" key={`ul-${blocks.length}`}>
          {currentList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      currentList = null;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    // Headings
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="text-xl font-semibold text-slate-50 mt-6 mb-3"
        >
          {line.replace("### ", "").trim()}
        </h3>
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="text-2xl font-semibold text-slate-50 mt-8 mb-4"
        >
          {line.replace("## ", "").trim()}
        </h2>
      );
      return;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h1
          key={`h1-${blocks.length}`}
          className="text-3xl sm:text-4xl font-semibold text-slate-50 mt-4 mb-4"
        >
          {line.replace("# ", "").trim()}
        </h1>
      );
      return;
    }

    // Blockquote
    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote
          key={`bq-${blocks.length}`}
          className="border-l-4 border-emerald-400/70 pl-4 italic text-slate-200 mb-4"
        >
          {line.replace(/^>\s?/, "").trim()}
        </blockquote>
      );
      return;
    }

    // List items
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const item = line.replace(/^[-*]\s+/, "").trim();
      if (!currentList) currentList = [];
      currentList.push(item);
      return;
    }

    // Regular paragraph line
    if (currentList) {
      // list ended, new paragraph
      flushList();
    }
    currentParagraph.push(line);
  });

  flushParagraph();
  flushList();

  return <div>{blocks}</div>;
}
