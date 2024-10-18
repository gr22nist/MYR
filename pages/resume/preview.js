import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { exportAllData } from '@/utils/indexedDB';
import ResumePreview from '@/components/preview/ResumePreview';
import { decryptData } from '@/utils/cryptoUtils';
import Link from 'next/link';
import { PDFDocument, rgb } from 'pdf-lib';
import html2canvas from 'html2canvas';

const PreviewPage = () => {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [printRef, setPrintRef] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const loadReactToPrint = async () => {
      const { print } = await import('react-to-print');
      setPrintRef(print);
    };
    loadReactToPrint();

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

  const handlePrint = async () => {
    if (!componentRef.current) return;

    // 버튼을 임시로 숨깁니다.
    const actionButtons = componentRef.current.querySelector('.action-buttons');
    if (actionButtons) {
      actionButtons.style.display = 'none';
    }

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: componentRef.current.scrollWidth,
      windowHeight: componentRef.current.scrollHeight,
    });

    // 버튼을 다시 표시합니다.
    if (actionButtons) {
      actionButtons.style.display = '';
    }

    const imgData = canvas.toDataURL('image/png');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width / 2, canvas.height / 2]);

    const pngImage = await pdfDoc.embedPng(imgData);
    const { width, height } = page.getSize();
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.pdf';
    link.click();
  };

  if (isLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div className='layout-container' ref={componentRef}>
      <div className="action-buttons">
        <Link href="/resume" legacyBehavior>
          <a className="back-btn">돌아가기</a>
        </Link>
        <button onClick={handlePrint} className="print-btn">PDF 저장</button>
      </div>
      {resumeData ? (
        <ResumePreview resumeData={resumeData} />
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    </div>
  );
};

export default PreviewPage;
