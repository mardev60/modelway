/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#262626",
        "primary-100": "#3e3e3e",
        "primary-200": "#585858",
        "primary-300": "#727272",
        "primary-400": "#8c8c8c",
        "primary-500": "#a6a6a6",
      },
    },
  },
  plugins: [],
};
