import { useState, useCallback } from 'react';

export const useIMEInput = (initialValue = '', onChange) => {
  const [composing, setComposing] = useState(false);
  const [internalValue, setInternalValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (!composing) {
      onChange(e);
    }
  }, [composing, onChange]);

  const handleCompositionStart = useCallback(() => {
    setComposing(true);
  }, []);

  const handleCompositionEnd = useCallback((e) => {
    setComposing(false);
    onChange(e);
  }, [onChange]);

  return {
    value: internalValue,
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
  };
};
