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
      },
      animation: {
        'fade-up':    'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in':    'fadeIn 0.3s ease both',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.4,0,0.2,1) both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(124,58,237,0)' }, '50%': { boxShadow: '0 0 20px 4px rgba(124,58,237,0.28)' } },
      },
      screens: { 'xs': '380px' },
    },
  },
  plugins: [],
}
