/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      fontSize: {
        clamp: "clamp(3rem, 13vw, 8rem)",
      },
      lineHeight: {
        clamp: "clamp(3rem, 13vw, 8rem)",
      },
    },
  },
  plugins: [],
};
