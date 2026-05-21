/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        surface: '#111827',
        border: '#1f2937',
        accent1: '#00d4ff',
        accent2: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'text-primary': '#f9fafb',
        'text-secondary': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0,212,255,0.35)',
        'neon-purple': '0 0 20px rgba(124,58,237,0.35)',
      },
      animation: {
        'float-up': 'floatUp 1s ease-out forwards',
        'badge-burst': 'badgeBurst 0.8s ease-out forwards',
        'flash-good': 'flashGood 0.5s ease-out',
        'flash-bad': 'flashBad 0.5s ease-out',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
        badgeBurst: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flashGood: {
          '0%,100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(16,185,129,0.25)' },
        },
        flashBad: {
          '0%,100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239,68,68,0.25)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
    },
  },
  plugins: [],
};
