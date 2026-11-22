import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        foreground: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        primary: {
          DEFAULT: "var(--primary-accent)",
          hover: "var(--primary-hover)",
          foreground: "var(--background)",
          soft: "var(--soft-accent)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "#FFFFFF",
          soft: "var(--soft-accent)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "var(--muted-surface)",
          foreground: "var(--text-secondary)",
        },
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
