import { useState } from 'react';
import { useIMEInput } from '@/hooks/useIMEInput';

export const useFloatingLabel = (externalValue, externalOnChange, isTitle = false) => {
  const [isFocused, setIsFocused] = useState(false);
  const { value, onChange, onCompositionStart, onCompositionEnd } = useIMEInput(externalValue, externalOnChange);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputClasses = `
    floating-label-input
    ${isFocused ? 'floating-label-input-focused' : ''}
    ${isTitle ? 'floating-label-input-title' : ''}
  `;

  const labelClasses = `
    floating-label
    ${isFocused || value !== '' ? 'floating-label-active' : 'floating-label-inactive'}
    ${isTitle ? 'floating-label-title' : 'floating-label-normal'}
  `;

  return {
    isFocused,
    value,
    onChange,
    onCompositionStart,
    onCompositionEnd,
    handleFocus,
    handleBlur,
    inputClasses,
    labelClasses,
  };
};

