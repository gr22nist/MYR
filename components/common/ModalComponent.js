import React, { useCallback } from 'react';
import ReactModal from 'react-modal';

const ModalComponent = ({ isOpen, onClose, children }) => {
  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      className={{
        base: 'modal-content',
        afterOpen: 'modal-content-after-open',
        beforeClose: 'modal-content-before-close'
      }}
      overlayClassName={{
        base: 'modal-overlay',
        afterOpen: 'modal-overlay-after-open',
        beforeClose: 'modal-overlay-before-close'
      }}
      closeTimeoutMS={300}
    >
      <div className="font-sans relative p-6 bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 ease-in-out">
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </ReactModal>
  );
};

export default ModalComponent;
