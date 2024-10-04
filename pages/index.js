import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/resume');
  }, [router]);

  return null;
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/resume',
      permanent: false,
    },
  }
}
