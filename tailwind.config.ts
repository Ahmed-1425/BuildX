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
        primary: {
          DEFAULT: "#823419",
          dark: "#34155f",
        },
        lime: {
          DEFAULT: "#c3f937",
        },
        pink: {
          DEFAULT: "#fb50c3",
        },
        dark: {
          DEFAULT: "#0c1018",
          secondary: "#34155f",
        },
        light: {
          DEFAULT: "#e7edfd",
        },
      },
      fontFamily: {
        janna: ["var(--font-janna)", "Tahoma", "Arial", "sans-serif"],
        "janna-bold": [
          "var(--font-janna-bold)",
          "Tahoma",
          "Arial",
          "sans-serif",
        ],
        "news-almstqbl": [
          "var(--font-news-almstqbl)",
          "var(--font-janna-bold)",
          "Tahoma",
          "sans-serif",
        ],
        arapix: [
          "var(--font-arapix)",
          "var(--font-janna)",
          "monospace",
        ],
        bauhaus: [
          "var(--font-bauhaus)",
          "Impact",
          "sans-serif",
        ],
      },
      animation: {
        "pixel-pulse": "pixelPulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "typing": "typing 3.5s steps(30) 1s forwards",
        "blink": "blink 1s step-end infinite",
        "slide-up": "slideUp 0.6s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "progress": "progress 3s ease-in-out forwards",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        pixelPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        progress: {
          "0%": { width: "0%" },
          "80%": { width: "99%" },
          "100%": { width: "100%" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      boxShadow: {
        pixel: "4px 4px 0px 0px rgba(130, 52, 25, 0.5)",
        "pixel-lime": "4px 4px 0px 0px rgba(195, 249, 55, 0.3)",
        "pixel-pink": "4px 4px 0px 0px rgba(251, 80, 195, 0.3)",
        "pixel-hover": "6px 6px 0px 0px rgba(130, 52, 25, 0.6)",
        "pixel-pressed": "2px 2px 0px 0px rgba(130, 52, 25, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
