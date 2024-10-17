import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    window.addEventListener('resize', autoResize);
    return () => window.removeEventListener('resize', autoResize);
  }, []);

  const textareaClasses = `
    floating-label-input
    floating-label-textarea
    ${isFocused ? 'floating-label-input-focused' : 'bg-mono-f5'}
    ${isTitle ? 'floating-label-input-title' : ''}
    transition-all duration-300
    outline-none
    border-transparent
    focus:ring-0
    focus:border-transparent
    ${className}
  `;

  const labelClasses = `
    floating-label
    floating-label-textarea-label
    ${isFocused || value !== '' ? 'floating-label-active' : 'floating-label-inactive'}
    ${isTitle ? 'floating-label-title' : 'floating-label-normal'}
  `;

  return (
    <div className="floating-label-container w-full">
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
        spellCheck={spellCheck}
        maxLength={maxLength}
        rows={1}
        onInput={autoResize}
        {...props}
      />
      <label className={labelClasses}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelTextarea;
