module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "reverse-spin": {
          "100%": { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
