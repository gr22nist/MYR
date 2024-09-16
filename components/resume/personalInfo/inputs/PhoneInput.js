import React, { useState } from 'react';

const PhoneInput = ({ onChange }) => {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validatePhone = (value) => {
    // 한국 휴대폰 번호 형식만 허용 (010, 011, 016, 017, 018, 019)
    const phoneRegex = /^01[016789]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(value.replace(/-/g, ''));
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    if (value.length <= 3) {
      formattedValue = value;
    } else if (value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setPhone(formattedValue);
    setIsValid(validatePhone(formattedValue));
  };

  const handleConfirm = () => {
    if (isValid && phone) {
      onChange(phone);
      setPhone(''); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">휴대폰 번호</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          className={`flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${!isValid && phone ? 'border-red-500' : ''}`}
        />
        <button
          onClick={handleConfirm}
          disabled={!isValid || !phone}
          className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          확인
        </button>
      </div>
      {!isValid && phone && <p className="mt-1 text-sm text-red-500">유효한 휴대폰 번호를 입력해주세요.</p>}
    </div>
  );
};

export default PhoneInput;
