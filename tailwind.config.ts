import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          black: "#0a0a0a",
          dark: "#111111",
          card: "#161616",
          border: "#222222",
          gray: "#888888",
          light: "#cccccc",
          white: "#f5f5f5",
          accent: "#e63946",
          gold: "#d4a843",
          blue: "#4a9eff",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(230, 57, 70, 0.3)",
        "glow-gold": "0 0 20px rgba(212, 168, 67, 0.3)",
        "glow-blue": "0 0 20px rgba(74, 158, 255, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(230, 57, 70, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(230, 57, 70, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
