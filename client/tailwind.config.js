/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        sage: {
          50: "#F4F8F4",
          100: "#E4EFE4",
          200: "#C9DFC9",
          500: "#5A8F6B",
          700: "#355E43",
          900: "#1D3626",
        },
        saffron: {
          100: "#FDF1DC",
          300: "#F7CA7E",
          500: "#E39B38",
          700: "#9E6313",
        },
      },
    },
  },
  plugins: [],
};
