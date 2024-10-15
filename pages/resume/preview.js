import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { exportAllData } from '@/utils/indexedDB';
import ResumePreview from '@/components/ResumePreview';
import { decryptData } from '@/utils/cryptoUtils';

const PreviewPage = () => {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await exportAllData();
      console.log('Exported data:', data); // 추가된 로그
      if (data) {
        const orderedData = [];
        let sectionOrder;
        try {
          // 섹션 순서가 문자열인 경우를 처리
          const decryptedOrder = decryptData(data.customSections?.sectionOrder?.order);
          console.log('Decrypted order:', decryptedOrder); // 추가된 로그
          sectionOrder = typeof decryptedOrder === 'string' ? decryptedOrder.split(',') : 
            ['userInfo', 'career', 'education'];
        } catch (error) {
          console.error('섹션 순서 복호화 오류:', error);
          sectionOrder = ['userInfo', 'career', 'education'];
        }

        console.log('Section order:', sectionOrder); // 추가된 로그

        // 프로필 데이터를 항상 맨 앞에 추가
        if (data.profile) {
          orderedData.push({ type: 'profile', data: data.profile });
        }

        sectionOrder.forEach(sectionId => {
          switch(sectionId) {
            case 'userInfo':
              if (data.userInfo) orderedData.push({ type: 'userInfo', data: data.userInfo });
              break;
            case 'career':
              if (data.careers) orderedData.push({ type: 'careers', data: data.careers });
              break;
            case 'education':
              if (data.educations) orderedData.push({ type: 'educations', data: data.educations });
              break;
            default:
              // 커스텀 섹션 처리
              const customSection = data.customSections?.customSections?.find(s => s.id === sectionId);
              if (customSection) {
                orderedData.push({ type: 'custom', data: customSection });
              }
          }
        });

        console.log('Ordered data:', orderedData); // 추가된 로그
        setResumeData(orderedData);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='layout-container'>
      <ResumePreview resumeData={resumeData} />
    </div>
  );
};

export default PreviewPage;
