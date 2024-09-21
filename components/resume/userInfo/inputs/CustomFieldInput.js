import React, { useState } from 'react';

const CustomFieldInput = ({ onChange }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onChange(title, value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="필드 제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="값 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button className="p-2 bg-blue-500 text-white" onClick={handleSubmit}>저장</button>
    </div>
  );
};

export default CustomFieldInput;
