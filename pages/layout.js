import React from "react";
import Head from "next/head";
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ToastComponent from '@/components/common/ToastComponent';
import MobileWarning from '@/components/MobileWarning';

const Layout = ({ children }) => {
  
  return (
    <div>
      <Head>
        <title>누구나 간단하게 작성하는 나의 역사, My력서</title>
        <meta name="description" content="누구나 간단하게 작성하는 나의 역사, My력서" />
        <meta property="og:title" content="마이력서" />
        <meta property="og:description" content="누구나 간단하게 작성하는 나의 역사, My력서" />
        <meta property="og:image" content="[이미지 URL]" />
        <meta property="og:url" content="[웹사이트 URL]" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="마이력서" />
        <meta name="twitter:description" content="누구나 간단하게 작성하는 나의 역사, My력서" />
        <meta name="twitter:image" content="[이미지 URL]" />
      </Head>
      <Navbar />
      <ToastComponent />
      <main className="bg-mono-ee py-8">
        <MobileWarning />
        { children }
      </main>
      <Footer />
    </div>
  );
};

export default Layout;