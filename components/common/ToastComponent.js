import React, { useEffect } from 'react';
import useGlobalStore from '@/store/globalStore';

const ToastComponent = () => {
  const { toastMessage, toastType, toastVisible, hideToast } = useGlobalStore();

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        hideToast(); // 3초 후에 토스트를 숨김
      }, 3000); // 3초 후 토스트 자동 숨김
      
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [toastVisible, hideToast]);

  if (!toastVisible) return null; // 토스트가 보이지 않을 때는 렌더링하지 않음

  const getToastColor = () => {
    switch (toastType) {
      case 'success':
        return 'bg-green-500/90';
      case 'error':
        return 'bg-red-500/90';
      case 'warning':
        return 'bg-yellow-500/90';
      case 'info':
        return 'bg-blue-500/90';
      default:
        return 'bg-gray-800/90';
    }
  };

  return (
    <div className={`
      toast
      fixed left-1/2 transform -translate-x-1/2 text-center
      p-4 max-w-sm w-full mx-4
      text-white 
      rounded-md shadow-lg
      z-50 transition-all duration-300 ease-in-out
      ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
      top-8 sm:top-16
      ${getToastColor()}
    `}>
      {toastMessage}
    </div>
  );
};

export default ToastComponent;
