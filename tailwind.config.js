// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // or 'media'
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
    "./src/store/**/*.{js,jsx,ts,tsx}",
    // Or just "./src/**/*.{js,jsx,ts,tsx}" if you want to capture everything under src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};