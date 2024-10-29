import React, { useState, useEffect } from 'react';

const AutoSaveIndicator = () => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 5000); // 5초마다 저장 상태 표시 (실제 저장 간격에 맞춰 조정)

    return () => clearInterval(saveInterval);
  }, []);

  return (
    <div className='flex items-center justify-end text-mono-66 gap-1 transition-opacity duration-300' 
         style={{ opacity: isSaving ? 1 : 0.3 }}>
      <span>데이터 실시간 저장 중</span>
      <svg className={`w-5 h-5 text-gray-500 ${isSaving ? 'animate-pulse' : ''}`} 
           fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' 
           viewBox='0 0 24 24' stroke='currentColor'>
        <path d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' />
      </svg>
    </div>
  );
};

export default AutoSaveIndicator;
