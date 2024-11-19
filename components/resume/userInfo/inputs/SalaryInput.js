import React, { useState, useCallback, useEffect } from 'react';
import { FormInput } from '@/components/ui/form-input';
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

  const formatSalary = useCallback((value) => {
    const numValue = parseInt(value, 10);
    if (numValue >= 10000) {
      const uk = Math.floor(numValue / 10000);
      const man = numValue % 10000;
      if (man === 0) {
        return `${uk.toLocaleString()}억`;
      }
      return `${uk.toLocaleString()}억 ${man.toLocaleString()}만`;
    }
    return `${numValue.toLocaleString()}만`;
  }, []);

  const handleChange = useCallback((value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
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

  const handleEnterPress = useCallback(() => {
    if (inputValue) {
      handleConfirm();
    }
  }, [inputValue, handleConfirm]);

  const handleKeyPress = useCallback((e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  const displayValue = inputValue ? inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

  return (
    <div>
      <FormInput
        label={
          <div className="flex justify-between items-center">
            <span>연봉</span>
            {confirmedValue && (
              <span className="text-sm text-gray-500">
                {confirmedValue}
              </span>
            )}
          </div>
        }
        id='salary'
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onEnterPress={handleEnterPress}
        placeholder='단위: 만'
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Button
        onClick={handleConfirm}
        disabled={!inputValue}
        className='mt-4 w-full'
      >
        확인
      </Button>
    </div>
  );
};

export default SalaryInput;