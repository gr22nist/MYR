import React, { useState, useEffect } from 'react';
import QuickBtns from './QuickBtns';

const FloatingControls = ({ onReset, onToggleAllSections, areAllSectionsExpanded }) => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 mx-auto bg-white rounded-full shadow-lg p-2">
      <QuickBtns 
        onReset={onReset} 
        onToggleAllSections={onToggleAllSections}
        areAllSectionsExpanded={areAllSectionsExpanded}
      />
    </div>
  );
};

export default FloatingControls;
