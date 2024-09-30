import React, { useState, useEffect } from 'react';
import QuickBtns from './QuickBtns';

const FloatingControls = ({ onReset, onToggleAllSections, areAllSectionsExpanded }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);  // sm 브레이크포인트
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  const positionClass = isMobile ? 'bottom-4 right-4' : 'top-4 right-4';

  return (
    <div className={`fixed ${positionClass} flex items-center space-x-2`}>
      <div className="transition-opacity duration-300" 
           style={{ opacity: isSaving ? 1 : 0.3 }}>
        <svg className={`w-5 h-5 text-gray-500 ${isSaving ? 'animate-pulse' : ''}`} 
             fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
             viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </div>
      <QuickBtns 
        // onPreview={onPreview} 
        onReset={onReset} 
        onToggleAllSections={onToggleAllSections}
        areAllSectionsExpanded={areAllSectionsExpanded}
      />
    </div>
  );
};

export default FloatingControls;
