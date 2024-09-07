import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '@/redux/slices/uiSlice'; // hideToast 액션

const ToastComponent = () => {
  const dispatch = useDispatch();
  const { toastMessage, toastType, toastVisible } = useSelector((state) => state.ui);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast()); // 3초 후에 토스트를 숨김
      }, 3000); // 3초로 설정 (원한다면 5000으로 변경 가능)

      return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머를 정리
    }
  }, [toastVisible, dispatch]);

  if (!toastVisible) return null; // 토스트가 안 보일 때는 아무것도 렌더링하지 않음

  return (
    <div className={`toast toast-${toastType} fixed bottom-4 right-4 p-4 bg-gray-800 text-white`}>
      {toastMessage}
    </div>
  );
};

export default ToastComponent;
