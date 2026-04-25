/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand = teal / emerald. Used for buttons, active nav,
        // accent strokes, progress bars.
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Text / heading color = deep navy. Used for primary text and the
        // dark accent panel on the landing page.
        ink: {
          DEFAULT: "#0f172a",
          soft: "#334155",
          muted: "#64748b",
        },
        // Warmer off-white app background (stone-50-ish) for a less clinical feel
        paper: "#fafaf9",
        // Slightly warmer line color to match the stone background
        line: "#e7e5e4",
        // Semantic tones
        positive: "#047857",
        positiveSoft: "#d1fae5",
        negative: "#ea580c",
        negativeSoft: "#ffedd5",
        caution: "#b45309",
        cautionSoft: "#fef3c7",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      lineHeight: {
        relaxed: "1.65",
      },
      borderRadius: {
        xl: "0.875rem", // 14px — slightly softer card corners
        "2xl": "1.125rem", // 18px for hero panels
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.06)",
        lift: "0 4px 14px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(15, 23, 42, 0.05)",
        nav: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)",
        button: "0 1px 2px rgba(15, 23, 42, 0.08)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
};
