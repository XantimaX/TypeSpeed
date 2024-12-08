/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-color" : "#646669",
        "text-color" : "#d1d0c5"
      },

      fontFamily: {
        "parkinsans" : ["Poppins", "sans-serif"]
      }
    },
  },
  plugins: [],
}

