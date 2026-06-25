import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#030712",
          800: "#0a0f1c",
          700: "#111827",
          600: "#1a2332",
          500: "#243044",
          400: "#334155",
          300: "#475569",
          200: "#64748b",
          100: "#94a3b8",
        },
        accent: {
          500: "#10b981",
          400: "#34d399",
          300: "#6ee7b7",
          600: "#059669",
          700: "#047857",
        },
        teal: {
          500: "#14b8a6",
          400: "#2dd4bf",
          300: "#5eead4",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
          hover: "rgba(255, 255, 255, 0.08)",
        }
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
};
export default config;
