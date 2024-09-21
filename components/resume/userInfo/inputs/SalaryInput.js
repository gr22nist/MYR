import React, { useState } from 'react';

const SalaryInput = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  const formatSalary = (value) => {
    const numValue = parseInt(value, 10);
    if (numValue >= 10000) {
      const uk = Math.floor(numValue / 10000);
      const man = numValue % 10000;
      if (man === 0) {
        return `${uk}억 원`;
      }
      return `${uk}억 ${man.toLocaleString()}만 원`;
    }
    return `${numValue.toLocaleString()}만 원`;
  };

  const handleConfirm = () => {
    if (inputValue === '') {
      setConfirmedValue('');
      onChange('');
      return;
    }
    const formattedValue = formatSalary(inputValue);
    setConfirmedValue(formattedValue);
    onChange(formattedValue);
    setInputValue(''); // 입력 필드 초기화
  };

  return (
    <div>
      <label htmlFor="salary" className="block text-sm font-medium text-gray-700">연봉</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          id="salary"
          value={inputValue}
          onChange={handleChange}
          placeholder="0"
          className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          만원
        </span>
      </div>
      <button
        onClick={handleConfirm}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        입력 확인
      </button>
      {confirmedValue && (
        <p className="mt-2 text-sm text-gray-500">
          입력된 연봉: {confirmedValue}
        </p>
      )}
    </div>
  );
};

export default SalaryInput;