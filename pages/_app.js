import React, { useEffect } from 'react';
import { initializeDB } from '@/hooks/dbConfig';
import Layout from './layout';
import '../styles/globals.css';
import '../styles/modal.css';
import ReactModal from 'react-modal';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const myFont = localFont({
  src: '../public/fonts/NanumSquareNeo-Variable.woff2',
  weight: '400 700 900',
  variable: '--font-nanum',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],  // 폰트 로딩 실패 시 대체 폰트
  adjustFontFallback: 'Arial',  // 폰트 메트릭 조정을 위한 대체 폰트
});

ReactModal.setAppElement('#__next');

function MYR({ Component, pageProps }) {
  useEffect(() => {
    initializeDB().catch(error => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  return (
    <Layout className={`${myFont.variable} font-sans`}>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights/>
    </Layout>
  );
}

export default MYR;