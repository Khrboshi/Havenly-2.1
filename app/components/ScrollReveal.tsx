/**
 * app/components/ScrollReveal.tsx
 *
 * Intersection Observer wrapper that fades and slides children into view
 * as they enter the viewport. Used on marketing pages for scroll animations.
 */
"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  /** Extra Tailwind / CSS classes on the wrapper div */
  className?: string;
  /** When true, staggers children in sequence instead of animating the wrapper */
  stagger?: boolean;
  /** 0–1 fraction of element visible before triggering (default 0.12) */
  threshold?: number;
}

/**
 * ScrollReveal
 * ─────────────────────────────────────────────────────
 * Fades + slides children into view when they enter the viewport.
 *
 * Single element:   <ScrollReveal> ... </ScrollReveal>
 * Staggered grid:   <ScrollReveal stagger className="grid grid-cols-3 gap-4"> ... </ScrollReveal>
 *
 * CSS classes (.reveal, .stagger-children, .is-visible) live in globals.css
 */
export default function ScrollReveal({
  children,
  className = "",
  stagger = false,
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el); // fire once only
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${stagger ? "stagger-children" : "reveal"} ${className}`}
    >
      {children}
    </div>
  );
}
