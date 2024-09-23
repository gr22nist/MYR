import React, { useState } from 'react';
import { commonStyles } from '@/styles/constLayout';

const FloatingLabelInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  className = '', 
  isTitle = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputClassName = `
    w-full pt-5 
    transition-colors duration-200
    ${commonStyles.focusStyle}
    ${commonStyles.inputBase}
    ${isFocused ? 'bg-blue-50' : 'bg-mono-f5'}
    ${isTitle ? 'text-xl font-bold' : ''}
    ${className}
  `;

  const labelClassName = `
    absolute left-2 transition-all duration-200
    ${isFocused || value !== ''
      ? `top-1 text-xs ${isTitle ? 'text-base font-semibold' : 'text-sm'}`
      : `top-3 text-gray-400 ${isTitle ? 'text-base' : 'text-sm'}`
    }
  `;

  return (
    <div className="relative">
      <input
        type={type}
        className={inputClassName}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={isFocused ? placeholder : ''}
        {...props}
      />
      <label className={labelClassName}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
