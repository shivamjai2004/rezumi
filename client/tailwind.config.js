/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        dark: {
          900: '#0f0f13',
          800: '#1a1a24',
          700: '#22223a',
          600: '#2d2d4a',
          500: '#3d3d5c',
        }
      }
    },
  },
  plugins: [],
}