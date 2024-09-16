import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '@/redux/slices/globalSlice';

const ToastComponent = () => {
  const dispatch = useDispatch();
  const { toastMessage, toastType, toastVisible } = useSelector((state) => state.global);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast()); // 3초 후에 토스트를 숨김
      }, 3000); // 3초 후 토스트 자동 숨김
      
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [toastVisible, dispatch]);

  if (!toastVisible) return null; // 토스트가 보이지 않을 때는 렌더링하지 않음

  return (
    <div className={`toast toast-${toastType} fixed bottom-4 right-4 p-4 bg-gray-800 text-white`}>
      {toastMessage}
    </div>
  );
};

export default ToastComponent;
