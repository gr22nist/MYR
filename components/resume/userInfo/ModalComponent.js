import React from 'react';

const ModalComponent = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        {children}
        <button className="mt-4 p-2 bg-red-500 text-white" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ModalComponent;
