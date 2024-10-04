import React, { useState, useRef, useEffect } from 'react';
import { floatingLabel } from '@/styles/constLayout';
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

  const textareaClasses = floatingLabel.textarea(isFocused, isTitle);
  const labelClasses = floatingLabel.textareaLabel(isFocused, value, isTitle);

  return (
    <div className={floatingLabel.container}>
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
