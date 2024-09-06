import React from 'react';

const InputField = ({ label, children, onRemove }) => {
  return (
    <div className="relative flex flex-col">
      <label className="font-semibold text-gray-700 text-sm">{label}</label>
      {children}
      <span onClick={onRemove} className="absolute top-0 right-0 cursor-pointer text-red-500">
        x
      </span>
    </div>
  );
};

export default InputField;