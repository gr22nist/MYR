import React, { useState, useCallback, useEffect } from 'react';
import { FormInput } from '@/components/ui/form-input';
import Button from '@/components/common/Button';

const BirthDateInput = ({ onChange, onClose, initialValue }) => {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      const cleaned = initialValue.replace(/\//g, '');
      const yymmdd = cleaned.slice(-6);
      setBirthDate(yymmdd);
      setConfirmedValue(initialValue);
      setError('');
    }
  }, [initialValue]);

  const isLeapYear = useCallback((year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }, []);

  const validateDate = useCallback((date) => {
    if (date.length !== 6) return false;
    const year = parseInt(date.slice(0, 2));
    const month = parseInt(date.slice(2, 4));
    const day = parseInt(date.slice(4, 6));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    if (month === 2) {
      if (isLeapYear(year + 2000)) {
        if (day > 29) return false;
      } else {
        if (day > 28) return false;
      }
    }
    return true;
  }, [isLeapYear]);

  const handleChange = useCallback((value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setBirthDate(numericValue);
    
    if (numericValue.length === 6) {
      setError(validateDate(numericValue) ? '' : '유효한 생년월일을 입력해주세요.');
    } else {
      setError('');
    }
  }, [validateDate]);

  const handleConfirm = useCallback(() => {
    if (!error && birthDate.length === 6) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      
      let fullYear = parseInt(birthDate.slice(0, 2));
      const month = parseInt(birthDate.slice(2, 4));
      const day = parseInt(birthDate.slice(4, 6));

      if (fullYear + 2000 > currentYear) {
        fullYear += 1900;
      } else {
        fullYear += 2000;
      }

      let age = currentYear - fullYear;
      if (currentMonth < month || (currentMonth === month && currentDay < day)) {
        age--;
      }

      if (age < 13 || age > 120) {
        setError('생년월일은 13세부터 120세까지만 입력 가능합니다.');
        return;
      }

      const formattedDate = `${fullYear}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
      setConfirmedValue(formattedDate);
      onChange(formattedDate);
      onClose();
    }
  }, [error, birthDate, onChange, onClose]);

  const handleKeyPress = useCallback((e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleEnterPress = useCallback(() => {
    if (!error && birthDate.length === 6) {
      handleConfirm();
    }
  }, [error, birthDate, handleConfirm]);

  return (
    <div>
      <FormInput
        label={
          <div className="flex flex-col items-center">
            <span>생년월일</span>
            {confirmedValue && (
              <span className="text-sm text-gray-500">
                기존 입력값:{confirmedValue}
              </span>
            )}
          </div>
        }
        id='birthDate'
        value={birthDate}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onEnterPress={handleEnterPress}
        placeholder='생년월일 6자리'
        error={error}
        maxLength={6}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Button
        onClick={handleConfirm}
        disabled={!!error || birthDate.length !== 6}
        className='mt-4 w-full'
      >
        확인
      </Button>
    </div>
  );
};

export default BirthDateInput;