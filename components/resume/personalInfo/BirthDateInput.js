import React, { useState } from 'react';

const BirthDateInput = ({ onChange }) => {
  const [birthDate, setBirthDate] = useState('');

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거

    if (value.length <= 4) {
      value = value.replace(/(\d{4})/, '$1'); // YYYY
    } else if (value.length <= 6) {
      value = value.replace(/(\d{4})(\d{1,2})/, '$1/$2'); // YYYY/MM
    } else {
      value = value.replace(/(\d{4})(\d{2})(\d{1,2})/, '$1/$2/$3'); // YYYY/MM/DD
    }

    setBirthDate(value);
    onChange(value);
  };

  return (
    <input
      type="text"
      value={birthDate}
      onChange={handleInputChange}
      placeholder="YYYY/MM/DD"
      className="border p-2 text-sm"
    />
  );
};

export default BirthDateInput;
