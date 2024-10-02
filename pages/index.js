import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/resume');
  }, [router]);

  return null; // 또는 로딩 인디케이터를 표시할 수 있습니다.
}

// 서버 사이드 리다이렉트를 위한 getServerSideProps
export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/resume',
      permanent: false,
    },
  }
}
