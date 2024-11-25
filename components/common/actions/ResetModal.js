import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ResetModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] sm:max-w-[400px] p-6 gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-destructive">
            데이터 초기화
          </DialogTitle>
          <DialogDescription className="text-base text-destructive/80 leading-normal font-medium">
            모든 데이터를 초기화하시겠습니까? <br />
            데이터를 다시 한번 확인해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors font-medium"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
          >
            초기화
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetModal;
