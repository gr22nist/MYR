import React, { useEffect } from 'react';
import useGlobalStore from '@/store/globalStore';

const ToastComponent = () => {
  const { toastMessage, toastType, toastVisible, hideToast } = useGlobalStore();

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 1800);
      
      return () => clearTimeout(timer);
    }
  }, [toastVisible, hideToast]);

  if (!toastVisible) return null;

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
        return 'bg-mono-33/90';
    }
  };

  return (
    <div className={`
      toast
      fixed left-1/2 transform -translate-x-1/2 text-center
      p-4 max-w-sm w-full mx-4
      text-white 
      rounded shadow-lg
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
