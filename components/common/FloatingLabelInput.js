import React, { useState } from 'react';
import { commonStyles, combineClasses } from '@/styles/constLayout';
import { useIMEInput } from '@/hooks/useIMEInput';

const FloatingLabelInput = ({ 
  label, 
  value: externalValue, 
  onChange: externalOnChange, 
  placeholder, 
  type = 'text', 
  className = '', 
  isTitle = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { value, onChange, onCompositionStart, onCompositionEnd } = useIMEInput(externalValue, externalOnChange);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputClassName = combineClasses(
    'w-full p-4 transition-colors duration-200',
    commonStyles.focusStyle,
    commonStyles.inputBase,
    isFocused ? 'bg-blue-50' : 'bg-mono-f5',
    isTitle ? 'text-xl font-bold' : '',
    className
  );

  const labelClassName = combineClasses(
    'absolute right-2 transition-all duration-200',
    (isFocused || value !== '')
      ? `top-1 text-xs ${isTitle ? 'text-base font-semibold' : 'text-sm'}` 
      : 'top-3 text-gray-400 opacity-0'
  );

  return (
    <div className="relative">
      <input
        type={type}
        className={inputClassName}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder={placeholder}
        {...props}
      />
      <label className={labelClassName}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
