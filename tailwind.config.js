/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode with class-based toggling
  theme: {
    extend: {
      colors: {
        gray: {
          100: "rgb(243, 244, 246)",
          200: "rgb(229, 231, 235)", // Added for dark:text-gray-200
          300: "rgb(209, 213, 219)",
          400: "rgb(156, 163, 175)",
          800: "rgb(31, 41, 55)", // Added for dark:bg-gray-800
          900: "rgb(17, 24, 39)", // Added for dark:bg-gray-900
        },
        blue: {
          600: "rgb(37, 99, 235)",
          700: "rgb(29, 78, 216)",
        },
        green: {
          600: "rgb(22, 163, 74)",
          700: "rgb(21, 128, 61)",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};