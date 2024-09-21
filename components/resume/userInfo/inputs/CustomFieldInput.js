import React, { useState, useEffect } from 'react';

const CustomFieldInput = ({ onChange, initialValue = null }) => {
  const [title, setTitle] = useState(initialValue ? initialValue.displayType : '');
  const [value, setValue] = useState(initialValue ? initialValue.value : '');

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.displayType);
      setValue(initialValue.value);
    }
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(title, value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <label htmlFor="custom-title" className="text-sm font-medium text-gray-700 mb-1">
          제목
        </label>
        <input
          id="custom-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="custom-value" className="text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <input
          id="custom-value"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="내용을 입력하세요"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button type="submit">{initialValue ? '수정' : '추가'}</button>
    </form>
  );
};

export default CustomFieldInput;
