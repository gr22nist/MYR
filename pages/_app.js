import React from 'react';
import Layout from './layout';
import '../styles/globals.css';

function MYR ({ Component, pageProps }) {

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MYR;