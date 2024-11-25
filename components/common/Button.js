import React from 'react';

const Button = ({ children, onClick, disabled, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded font-medium text-white transition-all duration-300 ease-in-out
        ${disabled
          ? 'bg-mono-99 cursor-not-allowed'
          : 'bg-primary hover:bg-primary/90 active:bg-primary/95'}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
