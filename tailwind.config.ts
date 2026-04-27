/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50:  '#f7f8f0',
          100: '#edf0dc',
          200: '#d7ddb4',
          300: '#bac485',
          400: '#9aab59',
          500: '#7a8f3a',
          600: '#5f712c',
          700: '#4a5824',
          800: '#3d481e',
          900: '#343d1b',
        },
        gold: {
          400: '#d4a843',
          500: '#b8902a',
          600: '#9a7520',
        },
      },
      fontFamily: {
        serif:  ['var(--font-serif)', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans:   ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
