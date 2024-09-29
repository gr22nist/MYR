import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';

const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const AddressInput = ({ onChange, onClose }) => {
  const handleComplete = useCallback((data) => {
    const fullAddress = data.address;
    onChange(fullAddress);
    onClose();
  }, [onChange, onClose]);

  return (
    <div>
      <DaumPostcode onComplete={handleComplete} />
    </div>
  );
};

export default AddressInput;
