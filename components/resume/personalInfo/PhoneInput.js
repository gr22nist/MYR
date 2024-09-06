import React, { useState } from 'react';

const PhoneInput = ({ onChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거

    // 전화번호 포맷팅 (000-XXXX-XXXX 또는 000-XXX-XXXX)
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    }

    setPhoneNumber(value);
    onChange(value);

    // 유효성 검사 (010, 011, 016, 017, 018, 019 대역 허용)
    if (value.length === 13) { // 전화번호 포맷 완성 시에만 검사
      const phoneRegex = /^(01[016789])-(\d{3,4})-(\d{4})$/;
      setIsValid(phoneRegex.test(value));
    } else {
      setIsValid(true); // 길이가 부족하면 유효성 검사를 하지 않음
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phoneNumber}
        onChange={handleInputChange}
        placeholder="휴대폰 번호를 입력하세요"
        className={`border p-2 ${isValid ? 'border-gray-300' : 'border-red-500'}`}
      />
      {!isValid && <p className="text-red-500 text-sm mt-1">유효한 전화번호를 입력하세요.</p>}
    </div>
  );
};

export default PhoneInput;
