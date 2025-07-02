// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme";
import { createThemes } from "magicui/themes";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ fixed typo from 'darkmode'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
  'bg-gradient-to-br',
  'from-white', 'via-gray-100', 'to-gray-200',
  'from-gray-900', 'via-gray-800', 'to-gray-700',
  'from-pink-200', 'via-purple-200', 'to-indigo-200',
  'from-black', 'via-purple-900', 'to-indigo-800',
  'from-amber-50', 'via-yellow-100', 'to-stone-200',
  'from-indigo-950', 'via-purple-900', 'to-black',
  'text-gray-900', 'text-gray-100', 'text-purple-900',
  'text-blue-300', 'text-stone-800', 'text-violet-200'
],
  theme: {
    extend: {
      colors: {
        beige: "#f5f5dc",
        softPurple: "#2c003e",
        midPurple: "#4b007d",
        cream: "#fefae0",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
  },
  presets: [createThemes()],
  plugins: [],
};
