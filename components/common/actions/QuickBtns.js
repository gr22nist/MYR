import React, { useState } from 'react';
import { layout } from '@/styles/constLayout';
import { ResetBtn, ViewBtn } from '@/components/icons/IconSet';
import useUserInfoStore from '@/store/userInfoStore';

const QuickBtns = ({ onPreview, onReset }) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const { resetUserInfo } = useUserInfoStore();

  const toggleQuickMenu = () => {
    setIsQuickMenuOpen(!isQuickMenuOpen);
  };

  const handleReset = async () => {
    await resetUserInfo();
  };

  return (
    <>
      {/* 데스크톱 퀵버튼 */}
      <div className="hidden sm:block fixed right-4 bottom-4 transform -translate-y-1/2">
        <div className="bg-gray-800 bg-opacity-75 p-3 rounded-lg shadow-lg">
          <button 
            onClick={onPreview} 
            className={`${layout.previewButton} mb-2 w-full group relative overflow-hidden`}
          >
            <ViewBtn className="group-hover:opacity-0 transition-opacity duration-200" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              미리<br />보기
            </span>
          </button>
          <button 
            onClick={onReset} 
            className={`${layout.resetButton} w-full group relative overflow-hidden`}
          >
            <ResetBtn className="group-hover:opacity-0 transition-opacity duration-200" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              초기화
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 퀵버튼 */}
      <div className="sm:hidden fixed right-4 bottom-4">
        <button 
          onClick={toggleQuickMenu}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
        >
          {isQuickMenuOpen ? 'X' : '≡'}
        </button>
        {isQuickMenuOpen && (
          <div className="absolute right-0 bottom-16 bg-gray-800 bg-opacity-75 p-3 rounded-lg shadow-lg">
            <button onClick={onPreview} className={`${layout.previewButton} mb-2 w-full flex items-center justify-center`}>
              <ViewBtn className="w-6 h-6 mr-2" />
              <span>미리보기</span>
            </button>
            <button onClick={onReset} className={`${layout.resetButton} w-full flex items-center justify-center`}>
              <ResetBtn className="w-6 h-6 mr-2" />
              <span>초기화</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default QuickBtns;
