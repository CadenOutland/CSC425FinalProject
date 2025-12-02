/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
