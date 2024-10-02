import React, { useState, useEffect } from 'react';
import { isMobile } from '@/utils/deviceDetect';

const MobileWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setShowWarning(isMobile());
    const handleResize = () => setShowWarning(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-400 p-4 text-center z-50">
      <p>이 웹사이트는 PC에 최적화되어 있습니다. PC로 접속해 주세요.</p>
      <button 
        onClick={() => setShowWarning(false)} 
        className="mt-2 bg-white text-yellow-600 px-4 py-2 rounded"
      >
        닫기
      </button>
    </div>
  );
};

export default MobileWarning;
