/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#BAD3FF',
          300: '#84B3FF',
          400: '#4D8FFF',
          500: '#1E65FF', // Signature Electric Blue from the design
          600: '#1554E8',
          700: '#0E42C2',
          800: '#0B3399',
          900: '#082570',
          950: '#04133B',
        },
        navy: {
          50: '#F4F5F9',
          100: '#E8EAF1',
          200: '#C7CBDD',
          500: '#3D3B6A',
          700: '#1F1C48',
          800: '#120F3A',
          900: '#0B072E',
          950: '#070127', // Signature Midnight Navy typography from the design
        },
        gold: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF0C4',
          300: '#FCE497',
          400: '#F8D15B',
          500: '#E8B923',
          600: '#C99712',
          700: '#A1730B',
          800: '#7E550C',
          900: '#64420E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(7, 1, 39, 0.04)',
        'soft-hover': '0 14px 34px rgba(7, 1, 39, 0.08)',
        'glow-blue': '0 4px 18px rgba(30, 101, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
