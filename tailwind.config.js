/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: "#root",
  theme: {
    extend: {
      width:{
        "248": "248px"
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}