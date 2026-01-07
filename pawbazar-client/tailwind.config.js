/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#10b981",
          secondary: "#f59e0b",
          accent: "#3b82f6",
          neutral: "#374151",
          "base-100": "#ffffff",
          info: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        dark: {
          primary: "#10b981",
          secondary: "#f59e0b",
          accent: "#3b82f6",
          neutral: "#1f2937",
          "base-100": "#111827",
          info: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};
