/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors (matching data.dathere.com)
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#0288D1', // Main brand blue
          600: '#0277bd',
          700: '#01579b',
          800: '#014a87',
          900: '#003D5C', // Dark navy
        },
        // Dark mode colors
        dark: {
          bg: '#0a0f1e',
          card: '#1a1f2e',
          border: '#2a2f3e',
        }
      },
    },
  },
  plugins: [],
}