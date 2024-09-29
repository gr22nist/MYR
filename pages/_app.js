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
    initializeDB().catch(console.error);
  }, []);

  return (
    <Layout className={`${myFont.variable} font-sans`}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MYR;