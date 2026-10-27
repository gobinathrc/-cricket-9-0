/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          pitch: "#0d1b2a",
          gold: "#f59e0b",
          green: "#10b981",
          card: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  },
  plugins: [],
};
