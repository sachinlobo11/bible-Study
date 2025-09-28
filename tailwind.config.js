/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        xp: {
          bar: '#60a5fa',
          glow: '#a5b4fc',
        },
        glass: 'rgba(255,255,255,0.08)'
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 24px rgba(0,0,0,0.25)'
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px 0 rgba(165,180,252,0.45)' },
          '50%': { boxShadow: '0 0 24px 6px #60a5fa' },
        },
      },
      animation: {
        aurora: 'aurora 12s ease infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 12s linear infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
      backgroundImage: {
        aurora: "linear-gradient(120deg, rgba(99,102,241,0.35), rgba(56,189,248,0.25), rgba(16,185,129,0.25))",
      },
    },
  },
  plugins: [],
}
