/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sutonny OMJ"', 'SutonnyOMJ', 'SutonnyMJ', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.85rem', { lineHeight: '1.3rem' }],
        'sm': ['0.95rem', { lineHeight: '1.45rem' }],
        'base': ['1.05rem', { lineHeight: '1.65rem' }],
        'lg': ['1.2rem', { lineHeight: '1.8rem' }],
        'xl': ['1.35rem', { lineHeight: '1.95rem' }],
        '2xl': ['1.65rem', { lineHeight: '2.25rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
      },
      colors: {
        masik: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        savings: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
      },
    },
  },
  plugins: [],
};
