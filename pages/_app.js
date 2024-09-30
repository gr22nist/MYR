import React, { useEffect } from 'react';
import { initializeDB } from '@/hooks/dbConfig';
import Layout from './layout';
import '../styles/globals.css';
import '../styles/modal.css';
import ReactModal from 'react-modal';
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    {
      path: '../public/fonts/NanumSquareNeo-Variable.woff2',
      weight: '300 400 700 800 900',
      style: 'normal',
    },
  ],
  variable: '--font-nanum'
});

ReactModal.setAppElement('#__next');

function MYR ({ Component, pageProps }) {
  useEffect(() => {
    initializeDB().catch(error => {
      console.error('Failed to initialize database:', error);
      // 여기에 사용자에게 오류를 알리는 로직을 추가할 수 있습니다.
    });
  }, []);

  return (
    <Layout className={`${myFont.variable} font-sans`}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MYR;