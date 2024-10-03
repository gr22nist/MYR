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

  const positionClass = isMobile ? 'bottom-4 right-4' : 'bottom-4 right-56';

  return (
    <div className={`${positionClass} fixed bottom-8 right-4 z-50`}>
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
