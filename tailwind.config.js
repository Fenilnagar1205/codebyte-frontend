/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        bg:      "#0a0a0f",
        surface: "#12121a",
        "surface-hover": "#1a1a26",
        border:  "#1e1e2e",
        accent:  "#00f5a0",
        orange:  "#ff6b35",
        blue:    "#4a9eff",
        dim:     "#94a3b8",
        muted:   "#64748b",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 18px rgba(0,245,160,0.25)" },
          "50%":     { boxShadow: "0 0 36px rgba(0,245,160,0.45)" },
        },
        pulse2: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.35" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        spin: {
          "to": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.45s ease both",
        "shimmer":  "shimmer 3s linear infinite",
        "glow":     "glow 2.5s ease infinite",
        "pulse2":   "pulse2 1.6s ease infinite",
        "float":    "float 3s ease infinite",
        "spin-fast":"spin 0.7s linear infinite",
      },
    },
  },
  plugins: [],
};
