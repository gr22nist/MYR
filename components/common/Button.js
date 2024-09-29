import React from 'react';

const Button = ({ children, onClick, disabled, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-medium text-white transition-all duration-300 ease-in-out
        ${disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
