import React, { useState, useRef, useEffect } from 'react';
import { commonStyles, combineClasses } from '@/styles/constLayout';
import { useIMEInput } from '@/hooks/useIMEInput';

const FloatingLabelTextarea = ({ 
  label, 
  value: externalValue, 
  onChange: externalOnChange, 
  placeholder, 
  className = '', 
  isTitle = false,
  spellCheck = false,
  maxLength = 1000,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const { value, onChange, onCompositionStart, onCompositionEnd } = useIMEInput(externalValue, externalOnChange);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  const textareaClasses = combineClasses(
    commonStyles.inputBase,
    commonStyles.focusStyle,
    'w-full p-4 transition-colors duration-200 resize-none',
    isFocused ? 'bg-blue-50' : 'bg-mono-f5',
    isTitle ? 'text-xl font-bold' : '',
    className
  );

  const labelClasses = combineClasses(
    'absolute right-2 transition-all duration-200',
    (isFocused || value !== '')
      ? `top-1 text-xs ${isTitle ? 'text-base font-semibold' : 'text-sm'}` 
      : 'top-3 text-gray-400 opacity-0'
  );

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={textareaClasses}
        value={value}
        onChange={(e) => {
          onChange(e);
          autoResize();
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder={placeholder}
        {...props}
      />
      <label className={labelClasses}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelTextarea;
