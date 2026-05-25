/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand = bold yellow. Used for hero panels, primary CTAs
        // (as the accent text on black), highlights, and active states.
        brand: {
          50: "#fffef0",
          100: "#fffbcc",
          200: "#fff599",
          300: "#ffed66",
          400: "#ffe333",
          500: "#ffed00",
          600: "#e6d500",
          700: "#807500",
          800: "#4d4600",
          900: "#332e00",
          950: "#1a1700",
        },
        // Text / heading color = pure black. The bold rebrand uses
        // black-on-yellow and yellow-on-black as its core contrast pairing.
        ink: {
          DEFAULT: "#000000",
          soft: "#1f2937",
          muted: "#4b5563",
        },
        // Pure white app background — black/yellow/white system
        paper: "#ffffff",
        // Subtle neutral gray for interior page backgrounds & alternating
        // landing sections. Gives the page rhythm between bold yellow,
        // bright white cards, and the chunky black borders.
        paperSoft: "#f5f5f5",
        // Light gray default line; explicit black borders are used where the
        // design calls for chunky outlines.
        line: "#e5e7eb",
        // Semantic tones — positive green for "savings", alerts now in bold
        // red (yellow / black / red bold system). Negative-soft is a near-
        // neutral cream-pink so the red border and red text carry the signal.
        positive: "#15803d",
        positiveSoft: "#dcfce7",
        negative: "#dc2626",
        negativeSoft: "#fef2f2",
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
