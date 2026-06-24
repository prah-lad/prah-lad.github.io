import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        primary: "#00FF88",
        secondary: "#00C8FF",
        warn: "#FFB347",
        surface: "#0F1923",
        "surface-2": "#162030",
        muted: "#6B7280",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "data-flow": "dataFlow 1.5s ease-in-out infinite",
        "blink-cursor": "blinkCursor 1s step-end infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 5px #00FF88, 0 0 10px #00FF88" },
          "50%": { boxShadow: "0 0 20px #00FF88, 0 0 40px #00FF88, 0 0 60px #00FF88" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        dataFlow: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateX(10px)" },
        },
        blinkCursor: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
