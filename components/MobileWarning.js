import React, { useState, useEffect } from 'react';
import { isMobile } from '@/utils/deviceDetect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const MobileWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkMobileWarning = () => {
      const isMobileDevice = isMobile();
      const hideUntil = localStorage.getItem('hideWarningUntil');
      const shouldShow = isMobileDevice && (!hideUntil || new Date() > new Date(hideUntil));
      setShowWarning(shouldShow);
    };

    checkMobileWarning();
    const handleResize = () => checkMobileWarning();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = (hideForToday = false) => {
    if (hideForToday) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      localStorage.setItem('hideWarningUntil', tomorrow.toISOString());
    }
    setShowWarning(false);
  };

  return (
    <Dialog open={showWarning} onOpenChange={() => handleClose(false)}>
      <DialogContent className="max-w-[340px] sm:max-w-[400px] p-6 gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-semibold">
            모바일 접속 안내
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-normal">
            My력서는 PC 환경에 최적화되어 있습니다. <br />
            원활한 사용을 위해 PC로 접속해 주세요.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hideToday" 
              onCheckedChange={(checked) => {
                if (checked) handleClose(true);
              }}
            />
            <label
              htmlFor="hideToday"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              오늘 하루 보지 않기
            </label>
          </div>
          <button
            onClick={() => handleClose(false)}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
          >
            확인
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWarning;
