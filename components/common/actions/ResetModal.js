import React from 'react';
import ModalComponent from '@/components/common/ModalComponent';

const ResetModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <p>정말로 모든 데이터를 초기화하시겠습니까?</p>
      <div className='flex justify-end space-x-2 mt-4'>
        <button className='bg-gray-500 text-white px-4 py-2 rounded' onClick={onClose}>취소</button>
        <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={onConfirm}>초기화</button>
      </div>
    </ModalComponent>
  );
};

export default ResetModal;
