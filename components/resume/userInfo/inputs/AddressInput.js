import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const AddressInput = ({ onChange, onClose, initialValue }) => {
  const [address, setAddress] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setAddress(initialValue);
      setConfirmedValue(initialValue);
    }
  }, [initialValue]);

  const handleComplete = (data) => {
    const isRoadAddress = data.roadAddress !== '';
    const filteredAddress = isRoadAddress
      ? `${data.sido} ${data.sigungu} ${data.roadname}`
      : `${data.sido} ${data.sigungu} ${data.bname}`;

    setAddress(filteredAddress);
    onChange(filteredAddress);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      <DaumPostcode onComplete={handleComplete} />
    </div>
  );
};

export default AddressInput;