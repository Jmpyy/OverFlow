/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0a192f',
          dark: '#020c1b',
          cyan: '#64ffda',
          light: '#e6f1ff',
          gray: '#8892b0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
