import React from "react";
import Head from "next/head";
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ToastComponent from '@/components/common/ToastComponent';

const Layout = ({ children }) => {
  
  return (
    <>
      <Head>
        <title>마이력서</title>
        <meta name="description" content="누구나 간단하게 작성하는 나의 역사, My력서" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="누구나 간단하게 작성하는 나의 역사, My력서" />
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
        <meta name="twitter:card" content="" />
        <meta name="twitter:title" content="" />
        <meta name="twitter:descriptio" content="누구나 간단하게 작성하는 나의 역사, My력서" />
        <meta name="twitter:image" content="" />
      </Head>
      <Navbar />
      <ToastComponent />
      <main>
        { children }
      </main>
      <Footer />
    </>
  );
};

export default Layout;