import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1E3B',
          50: '#E6EBF2',
          100: '#CDD7E5',
          200: '#9BAECB',
          300: '#6986B1',
          400: '#375D97',
          500: '#0B1E3B',
          600: '#09182F',
          700: '#071223',
          800: '#050C18',
          900: '#02060C',
          950: '#010306',
        },
        secondary: {
          DEFAULT: '#1E8C7A',
          50: '#E8F5F3',
          100: '#D1EBE7',
          200: '#A3D7CE',
          300: '#75C3B6',
          400: '#47AF9D',
          500: '#1E8C7A',
          600: '#187062',
          700: '#125449',
          800: '#0C3831',
          900: '#061C18',
          950: '#030E0C',
        },
        accent: {
          DEFAULT: '#D7B770',
          50: '#F9F5ED',
          100: '#F3EBDB',
          200: '#E7D7B7',
          300: '#DBC393',
          400: '#D7B770',
          500: '#CFA44E',
          600: '#B38839',
          700: '#876729',
          800: '#5B461C',
          900: '#2E230E',
          950: '#171207',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};
export default config;
