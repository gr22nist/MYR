import React from 'react';

const InputField = ({ label, value, onChange, placeholder, className = '', inputStyle = {} }) => {
  return (
    <div className={`input-field ${className}`}>
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputStyle}`}
      />
    </div>
  );
};

export default InputField;
