/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          50: '#faf8f6',
          100: '#f3efe9',
          200: '#e6ddd2',
          300: '#d4c4b3',
          400: '#bfa48c',
          500: '#a8866d',
          600: '#8f6d57',
          700: '#765848',
          800: '#62493d',
          900: '#523e35',
          950: '#2c201b',
        },
      },
    },
  },
  plugins: [],
}
