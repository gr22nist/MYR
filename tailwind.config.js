import colors from './styles/colors';
import { fonts } from './utils/fonts';  // fonts 임포트 추가

/** @type {import('tailwindcss').Config} */
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  './styles/**/*.js',
];
export const theme = {
  extend: {
    colors: {
      ...colors,
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
    fontFamily: {
      sans: ['var(--font-nanum)', 'system-ui', 'sans-serif'],
    },
    width: {
      "myr": "1144px",
      "label": "520px",

    },
    maxWidth: {
      "myr": "1240px",
    },
    transitionDuration: {
      '400': '400ms',
    },
    keyframes: {
      itemEnter: {
        '0%': { opacity: '0', transform: 'translateY(-20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      itemExit: {
        '0%': { opacity: '1', transform: 'translateY(0)' },
        '100%': { opacity: '0', transform: 'translateY(-20px)' },
      },
    },
    animation: {
      'item-enter': 'itemEnter 300ms ease-out',
      'item-exit': 'itemExit 300ms ease-in',
    },
  },
};
export const plugins = [];
