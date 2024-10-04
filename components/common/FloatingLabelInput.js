import React, { useState, useRef, useEffect } from 'react';
import { floatingLabel } from '@/styles/constLayout';
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
  inputRef, // 새로 추가된 prop
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { value, onChange, onCompositionStart, onCompositionEnd } = useIMEInput(externalValue, externalOnChange);
  const internalRef = useRef(null);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = internalRef.current;
    }
  }, [inputRef]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputClassName = floatingLabel.input(isFocused, value, isCore, isTitle);
  const labelClassName = floatingLabel.label(isFocused, value, isTitle);

  return (
    <div className={floatingLabel.container}>
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
