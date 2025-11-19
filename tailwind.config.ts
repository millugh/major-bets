import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          teal: '#66F6FF',
          pink: '#F151FF',
          gold: '#FFC857',
          lime: '#B8FF5C',
        },
        surface: {
          900: '#05050a',
          800: '#0B0F1F',
          700: '#121c3b',
        },
      },
      fontFamily: {
        display: ['var(--font-unbounded)', 'cursive'],
        body: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(102, 246, 255, 0.45)',
      },
      animation: {
        ticker: 'ticker 40s linear infinite',
        pulseGlow: 'pulseGlow 2.6s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.7, boxShadow: '0 0 10px rgba(241, 81, 255, 0.4)' },
          '50%': { opacity: 1, boxShadow: '0 0 25px rgba(102, 246, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
