import React, { useState, useCallback, useEffect } from 'react';
import { FormInput } from '@/components/ui/form-input';
import Button from '@/components/common/Button';

const SalaryInput = ({ onChange, onClose, initialValue }) => {
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setSalary(initialValue);
      setConfirmedValue(initialValue);
      setError('');
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
    setSalary(numericValue);
  }, []);

  const handleConfirm = useCallback(() => {
    if (salary === '') {
      setConfirmedValue('');
      onChange('');
      onClose();
      return;
    }
    const formattedValue = formatSalary(salary);
    setConfirmedValue(formattedValue);
    onChange(formattedValue);
    onClose();
  }, [salary, formatSalary, onChange, onClose]);

  const handleEnterPress = useCallback(() => {
    if (salary) {
      handleConfirm();
    }
  }, [salary, handleConfirm]);

  const handleKeyPress = useCallback((e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      <FormInput
        label={confirmedValue && (
          <div className="user-info-input-label">
            <span>기존 입력값:</span>
            <span>{confirmedValue}</span>
          </div>
        )}
        id='salary'
        value={salary}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onEnterPress={handleEnterPress}
        placeholder='희망연봉 (만원)'
        error={error}
        maxLength={5}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Button
        onClick={handleConfirm}
        disabled={!!error || !salary}
        className='mt-4 w-full'
      >
        확인
      </Button>
    </div>
  );
};

export default SalaryInput;