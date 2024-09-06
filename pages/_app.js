// _app.js

import React from 'react';
import store from '@/redux/store';
import { Provider } from 'react-redux';
import Layout from './layout';
import '../styles/globals.css';

function MYR ({ Component, pageProps }) {

  return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
  );
}

export default MYR;