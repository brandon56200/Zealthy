import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-kantumruy-pro)'],
        'noto-sans': ['var(--font-noto-sans)'],
        'kantumruy-pro': ['var(--font-kantumruy-pro)'],
      },
      keyframes: {
        'slide-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' }
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'slide-out': 'slide-out 0.5s ease-out forwards',
        'slide-in': 'slide-in 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
};

export default config; 