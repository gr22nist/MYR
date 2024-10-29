import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { exportAllData } from '@/utils/indexedDB';
import ResumePreview from '@/components/preview/ResumePreview';
import { decryptData } from '@/utils/cryptoUtils';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactToPrint = dynamic(() => import('react-to-print').then(mod => ({ 
  default: mod.useReactToPrint 
})), { ssr: false });

const PreviewPage = () => {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(null);

  // 프린트 핸들러 설정
  const handlePrint = ReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'resume',
    removeAfterPrint: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await exportAllData();
        if (data) {
          const orderedData = [];
          let sectionOrder;
          try {
            const decryptedOrder = decryptData(data.customSections?.sectionOrder?.order);
            sectionOrder = Array.isArray(decryptedOrder) ? decryptedOrder : ['userInfo', 'career', 'education'];
          } catch (error) {
            console.error('섹션 순서 복호화 오류:', error);
            sectionOrder = ['userInfo', 'career', 'education'];
          }

          if (data.profile) {
            orderedData.push({ type: 'profile', data: data.profile });
          }

          if (data.userInfo) {
            orderedData.push({ type: 'userInfo', data: data.userInfo });
          }

          sectionOrder.forEach(sectionId => {
            switch(sectionId) {
              case 'career':
                if (data.careers) orderedData.push({ type: 'careers', data: data.careers });
                break;
              case 'education':
                if (data.educations) orderedData.push({ type: 'educations', data: data.educations });
                break;
              default:
                const customSection = data.customSections?.customSections?.find(s => s.id === sectionId);
                if (customSection) {
                  orderedData.push({ type: 'custom', data: customSection });
                }
            }
          });

          setResumeData(orderedData);
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('데이터 로딩 중 오류 발생:', err);
        setError('데이터 로딩 중 오류 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div className='layout-container'>
      <div className='action-btns'>
        <Link href='/resume' className='back-btn'>
          돌아가기
        </Link>
        <button onClick={handlePrint} className='print-btn'>
          인쇄하기
        </button>
      </div>
      
      <section className='layout-section' ref={componentRef}>
        {resumeData ? (
          <ResumePreview resumeData={resumeData} />
        ) : (
          <div>데이터가 없습니다.</div>
        )}
      </section>
    </div>
  );
};

export default PreviewPage;
