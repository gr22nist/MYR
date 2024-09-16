import React, { useState } from 'react';

const BirthDateInput = ({ onChange }) => {
  const [birthDate, setBirthDate] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateDate = (date) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(date)) return false;
    
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    let formattedValue = value.replace(/\D/g, '');
    if (formattedValue.length > 4) {
      formattedValue = `${formattedValue.slice(0, 4)}-${formattedValue.slice(4, 6)}-${formattedValue.slice(6, 8)}`;
    } else if (formattedValue.length > 6) {
      formattedValue = `${formattedValue.slice(0, 4)}-${formattedValue.slice(4, 6)}-${formattedValue.slice(6, 8)}`;
    }
    setBirthDate(formattedValue);
    setIsValid(validateDate(formattedValue));
  };

  const handleConfirm = () => {
    if (isValid && birthDate.length === 10) {
      const formattedDate = birthDate.replace(/-/g, '/');
      onChange(birthDate);
      setBirthDate(''); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">생년월일</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          id="birthDate"
          value={birthDate}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
          className={`flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${!isValid && birthDate.length === 10 ? 'border-red-500' : ''}`}
        />
        <button
          onClick={handleConfirm}
          disabled={!isValid || birthDate.length !== 10}
          className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          확인
        </button>
      </div>
      {!isValid && birthDate.length === 10 && <p className="mt-1 text-sm text-red-500">유효한 생년월일을 입력해주세요.</p>}
    </div>
  );
};

export default BirthDateInput;
