import React, { useState, useRef, useEffect } from 'react';
import { commonStyles, combineClasses } from '@/styles/constLayout';

const FloatingLabelTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== '');

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  const textareaClasses = combineClasses(
    commonStyles.inputBase,
    commonStyles.focusStyle,
    commonStyles.placeholderStyle,
    'w-full pt-5 transition-colors duration-200',
    isFocused ? 'bg-blue-50' : 'bg-mono-f5',
    className
  );

  const labelClasses = combineClasses(
    'absolute left-2 transition-all duration-200',
    isFocused || value !== ''
      ? 'top-1 text-xs text-gray-500'
      : 'top-3 text-base text-gray-400 opacity-0'
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
