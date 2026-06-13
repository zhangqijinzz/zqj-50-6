/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#FFF7EE',
          100: '#FFE8D1',
          200: '#FFD0A3',
          300: '#FFB563',
          400: '#FF9B38',
          500: '#FF8A3D',
          600: '#F07019',
          700: '#C8570C',
          800: '#9F4410',
          900: '#7A3512',
        },
        cream: {
          50: '#FFFBF5',
          100: '#FFF8F0',
          200: '#FFEFE0',
        },
        fresh: {
          DEFAULT: '#52C41A',
          light: '#95DE64',
          dark: '#389E0D',
        },
        warn: {
          DEFAULT: '#FAAD14',
          light: '#FFD666',
          dark: '#D48806',
        },
        danger: {
          DEFAULT: '#F5222D',
          light: '#FF7875',
          dark: '#CF1322',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'sans-serif'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(255, 138, 61, 0.15)',
        'card': '0 8px 32px -8px rgba(0, 0, 0, 0.08)',
        'float': '0 12px 40px -12px rgba(255, 138, 61, 0.25)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'float-up': 'float-up 0.4s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
