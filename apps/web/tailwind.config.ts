import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        surface: "#111111",
        accent: "#F5A623",
        foreground: "#F0EDE8",
        muted: "rgba(240, 237, 232, 0.55)",
        subtle: "rgba(240, 237, 232, 0.28)",
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.125em",
      },
      spacing: {
        section: "6.25rem",
      },
      animation: {
        ticker: "ticker 40s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
