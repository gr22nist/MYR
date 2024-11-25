import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SaveIcon } from '@/components/icons/IconSet';

const AutoSaveIndicator = () => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="autosave-indicator cursor-default" 
               style={{ opacity: isSaving ? 1 : 0.3 }}>
            <SaveIcon width={16} height={16} className={`save-icon ${isSaving ? 'animate-pulse' : ''}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>데이터 실시간 저장 중</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AutoSaveIndicator;
