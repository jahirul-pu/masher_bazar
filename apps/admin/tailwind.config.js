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
        mono: ['"Sutonny OMJ"', 'SutonnyOMJ', 'ui-monospace', 'monospace'],
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
        admin: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a',
        },
        masik: {
          600: '#059669',
          700: '#047857',
        },
      },
    },
  },
  plugins: [],
};
