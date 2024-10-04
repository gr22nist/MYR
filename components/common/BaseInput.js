import React from 'react';

const BaseInput = ({ label, id, value, onChange, placeholder, error, type = 'text', multiline, ...props }) => {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <InputComponent
          type={multiline ? undefined : type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 rounded-lg border transition-all duration-300 ease-in-out
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:border-transparent
            placeholder-gray-400
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 absolute">{error}</p>
        )}
    </div>
  );
};

export default BaseInput;
