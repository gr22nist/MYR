import colors from './styles/colors';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export const content = [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './styles/**/*.js',
];
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      ...colors,
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
        ...colors.primary
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
        ...colors.secondary
      },
    },
    fontSize: {
      base: ['1rem', { lineHeight: '1.5' }],
    },
    fontFamily: {
      suit: ['var(--font-suit)'],
    },
    width: {
      'myr': '1144px',
      'label': '520px',

    },
    maxWidth: {
      'myr': '1240px',
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
        '0%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    },
    animation: {
      'item-enter': 'itemEnter 300ms ease-out',
      'item-exit': 'itemExit 300ms ease-in',
      skeleton: 'skeleton 1.5s infinite',
    },
    willChange: {
      'height': 'height',
    },
    transformOrigin: {
      'gpu': 'translateZ(0)',
    },
    typography: {
      DEFAULT: {
        css: {
          maxWidth: 'none',
          color: colors.mono[11],
          a: {
            color: colors.primary.light,
            '&:hover': {
              color: colors.primary.dark,
            },
          },
        },
      },
    },
  },
};
export const plugins = [
  typography,
  function({ addUtilities }) {
    const newUtilities = {
      '.page-break-inside-avoid': {
        'page-break-inside': 'avoid',
      },
      '.contain-content': {
        'contain': 'content',
      },
      '.text-render-speed': {
        'text-rendering': 'optimizeSpeed',
      },
      '.backface-hidden': {
        'backface-visibility': 'hidden',
      },
      '.font-smooth-antialiased': {
        '-webkit-font-smoothing': 'antialiased',
      },
    }
    addUtilities(newUtilities, ['responsive', 'hover'])
  }
];
