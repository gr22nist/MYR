import React, { useState, useEffect } from 'react';

const CustomFieldInput = ({ onChange, initialValue, isEditing }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title || '');
      setValue(initialValue.value || '');
    }
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(title, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="custom-title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          id="custom-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="custom-value" className="block text-sm font-medium text-gray-700">
          내용
        </label>
        <input
          type="text"
          id="custom-value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        확인
      </button>
    </form>
  );
};

export default CustomFieldInput;
