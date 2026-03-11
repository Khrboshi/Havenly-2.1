import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
        // ─── Consolidated Havenly brand palette ───────────────────────────
        // ONE green accent. Use hvn-mint everywhere instead of emerald-500.
        hvn: {
          mint:      "#3ee7b0",  // Primary accent
          "mint-dim":"#2bc99a",  // Hover state
          bg:        "#020617",  // Base background
          elevated:  "#02091a",  // Elevated surfaces
          soft:      "#0b1220",  // Soft background
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
