import React, { useRef, useEffect } from 'react';
import Tooltip from '@/components/common/Tooltip';
import { useFloatingLabel } from '@/hooks/useFloatingLabel';

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
  inputRef,
  ...props 
}) => {
  const {
    value,
    onChange,
    onCompositionStart,
    onCompositionEnd,
    handleFocus,
    handleBlur,
    inputClasses,
    labelClasses,
  } = useFloatingLabel(externalValue, externalOnChange, isTitle);

  const internalRef = useRef(null);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = internalRef.current;
    }
  }, [inputRef]);

  const finalInputClasses = `
    ${inputClasses}
    ${isCore && !value ? 'floating-label-input-core' : ''}
  `;

  return (
    <div className="floating-label-container">
      <Tooltip content={isCore && !value ? tooltipMessage : ""} disabled={!!value}>
        <input
          ref={internalRef}
          type={type}
          className={finalInputClasses}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          placeholder={placeholder}
          spellCheck={spellCheck}
          maxLength={maxLength}
          {...props}
        />
      </Tooltip>
      <label className={labelClasses}>
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
