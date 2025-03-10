/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0197D6',
          light: '#33aede',
          dark: '#0177a8',
        }
      },
      fontFamily: {
        nexa: ['Nexa', 'sans-serif'],
      },
    },
  },
  plugins: [],
};