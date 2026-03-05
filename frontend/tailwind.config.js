/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#030712',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
}
