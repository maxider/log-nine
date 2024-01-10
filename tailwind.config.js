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
      },
      colors: {
        "whitesmoke": "#f5f5f5"
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}