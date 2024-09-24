// utils/fonts.js

import localFont from 'next/font/local'

export const nanum = localFont({
  src: [
    {
      path: '../public/fonts/NanumSquareNeo-Variable.woff2',
      weight: '300,400,700,800,900',
      style: 'normal',
    },
  ],
  variable: '--font-nanum',
  lineHeight: '1.5',
})