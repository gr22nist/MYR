import React, { useState } from 'react';
import { commonStyles, combineClasses } from '@/styles/constLayout';
import { useIMEInput } from '@/hooks/useIMEInput';
import Tooltip from '@/components/common/Tooltip';

const FloatingLabelInput = ({ 
  label, 
  value: externalValue, 
  onChange: externalOnChange, 
  placeholder, 
  type = 'text', 
  className = '', 
  isTitle = false,
  isCore = false,
  tooltipMessage = '',
  spellCheck = false,
  maxLength = 100,
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
    isFocused 
      ? (value ? 'bg-blue-50' : (isCore ? 'bg-pink-50' : 'bg-blue-50'))
      : (isCore && !value ? 'bg-pink-50' : 'bg-mono-f5'),
    isCore && !value ? 'border-pink-200' : '',
    isTitle ? 'text-xl font-bold' : '',
    className
  );

  const labelClassName = combineClasses(
    'absolute right-4 transition-all duration-200',
    (isFocused || value !== '')
      ? `top-2 text-xs ${isTitle ? 'text-base font-semibold' : 'text-sm'}` 
      : 'top-7 text-gray-400 opacity-0',
    isTitle ? 'text-gray-900' : 'text-gray-500'
  );

  return (
    <div className="relative">
      <Tooltip content={isCore && !value ? tooltipMessage : ""} disabled={!!value}>
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
      </Tooltip>
      <label className={labelClassName}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
