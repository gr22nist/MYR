import { useState, useCallback } from 'react';

export const useIMEInput = (initialValue = '', onChange) => {
  const [isComposing, setIsComposing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (!isComposing) {
      onChange(newValue);
    }
  }, [isComposing, onChange]);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback((e) => {
    setIsComposing(false);
    onChange(e.target.value);
  }, [onChange]);

  const updateValue = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return {
    value,
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    updateValue
  };
};
