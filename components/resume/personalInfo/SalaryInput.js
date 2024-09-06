import React from 'react';

const SalaryInput = ({ onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex">
      <input
        type="number"
        placeholder="희망 연봉 입력"
        onChange={handleInputChange}
        className="border p-2 text-sm"
      />
      <span className="p-2">만원</span>
    </div>
  );
};

export default SalaryInput;
