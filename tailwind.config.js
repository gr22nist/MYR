import colors from './styles/colors';
import { fonts } from './utils/fonts';  // fonts 임포트 추가

/** @type {import('tailwindcss').Config} */
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  './styles/**/*.js',
];
export const theme = {
  extend: {
    colors: {
      ...colors,
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
    fontSize: {
      // 기본 폰트 크기와 라인 높이 설정
      base: ['1rem', { lineHeight: '1.5' }],
    },
    fontFamily: {
      suit: ["var(--font-suit)"],
      // nanum: ["var(--font-nanum)"],
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
      skeleton: {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
    },
    animation: {
      'item-enter': 'itemEnter 300ms ease-out',
      'item-exit': 'itemExit 300ms ease-in',
      skeleton: 'skeleton 1.5s infinite',
    },
  },
};
export const plugins = [
  function({ addUtilities }) {
    const newUtilities = {
      '.page-break-inside-avoid': {
        'page-break-inside': 'avoid',
      },
    }
    addUtilities(newUtilities, ['responsive', 'hover'])
  }
];
