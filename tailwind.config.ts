import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        body:    ["var(--font-body)",    "DM Sans",  "system-ui", "sans-serif"],
        sans:    ["var(--font-body)",    "DM Sans",  "system-ui", "sans-serif"],
      },
      colors: {
        // ─── Quiet Mirror system-aware palette ────────────────────────────
        // Dark mode:  periwinkle blue #7c9fff + soft violet #9b8fd4 + deep navy bg
        // Light mode: royal blue #2563eb + emerald green #059669 + white bg
        // All via CSS variables — tailwind reads them automatically
        emerald: {
          300: "#6ee7b7",
          400: "#34d399",
          500: "var(--hvn-accent-mint)",
          600: "var(--hvn-accent-mint-hover)",
        },
        violet: {
          400: "#a78bfa",
          500: "var(--hvn-accent-blue)",
        },
        slate: {
          950: "var(--hvn-bg)",
          900: "var(--hvn-bg-elevated)",
        },
        hvn: {
          bg:       "var(--hvn-bg)",
          elevated: "var(--hvn-bg-elevated)",
          soft:     "var(--hvn-bg-soft)",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.65s ease-out forwards",
        "fade-in":    "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
