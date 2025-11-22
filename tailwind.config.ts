import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        havenly: {
          bg: "#020617",
          card: "#020617",
          accent: "#34d399"
        }
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
