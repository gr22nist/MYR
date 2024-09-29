import React, { useState, useCallback, useEffect } from 'react';
import BaseInput from '@/components/common/BaseInput';
import Button from '@/components/common/Button';

const SalaryInput = ({ onChange, onClose, initialValue }) => {
  const [inputValue, setInputValue] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setInputValue(initialValue.replace(/[^0-9]/g, ''));
      setConfirmedValue(initialValue);
    }
  }, [initialValue]);

  const handleChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  }, []);

  const formatSalary = useCallback((value) => {
    const numValue = parseInt(value, 10);
    if (numValue >= 10000) {
      const uk = Math.floor(numValue / 10000);
      const man = numValue % 10000;
      if (man === 0) {
        return `${uk.toLocaleString()}억 원`;
      }
      return `${uk.toLocaleString()}억 ${man.toLocaleString()}만 원`;
    }
    return `${numValue.toLocaleString()}만 원`;
  }, []);

  const handleConfirm = useCallback(() => {
    if (inputValue === '') {
      setConfirmedValue('');
      onChange('');
      onClose();
      return;
    }
    const formattedValue = formatSalary(inputValue);
    setConfirmedValue(formattedValue);
    onChange(formattedValue);
    onClose();
  }, [inputValue, formatSalary, onChange, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      handleConfirm();
    }
  }, [handleConfirm, inputValue]);

  const displayValue = inputValue ? inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';

  return (
    <div>
      <div className="relative mb-4">
        <BaseInput
          label="연봉"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="0"
        />
        <span className="absolute top-0 right-0 text-sm text-mono-99">단위: 만원</span>
      </div>
      <Button
        onClick={handleConfirm}
        disabled={!inputValue}
        className="mt-4 w-full"
      >
        확인
      </Button>
      {confirmedValue && (
        <p className="mt-2 text-sm text-gray-500">
          입력된 연봉: {confirmedValue}
        </p>
      )}
    </div>
  );
};

export default SalaryInput;