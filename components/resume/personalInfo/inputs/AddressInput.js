import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// 카카오 우편번호 API 동적 로드
const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const AddressInput = ({ onChange }) => {
  const [address, setAddress] = useState('');

  const handleComplete = (data) => {
    const isRoadAddress = data.roadAddress !== ''; // 도로명 주소인지 확인
    const filteredAddress = isRoadAddress
      ? `${data.sido} ${data.sigungu} ${data.roadname}` // 서울특별시 강남구 테헤란로
      : `${data.sido} ${data.sigungu} ${data.bname}`;  // 서울특별시 강남구 역삼동

    setAddress(filteredAddress);
    onChange(filteredAddress); // 상세주소가 없는 상태로 기본 주소만 전달
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      <DaumPostcode onComplete={handleComplete} />
      {address && (
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="상세 주소를 입력하세요"
          className="border p-2 mt-2 w-full"
        />
      )}
    </div>
  );
};

export default AddressInput;
