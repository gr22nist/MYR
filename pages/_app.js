import React, { useEffect } from 'react';
import { initializeDB } from '@/hooks/dbConfig';
import Layout from './layout';
import '../styles/globals.css';
import '../styles/modal.css';
import ReactModal from 'react-modal';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next'

const suit = localFont({
  src: '../public/fonts/SUIT-Variable.woff2',
  weight: '100 900',
  variable: '--font-suit',
  display: 'swap',
  preload: true,
});

ReactModal.setAppElement('#__next');

function MYR({ Component, pageProps }) {
  useEffect(() => {
    initializeDB().catch(error => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  return (
    <main className={`${suit.variable} font-suit`}>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights/>
      </Layout>
    </main>
  );
}

export default MYR;