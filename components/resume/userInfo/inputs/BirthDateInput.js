import React, { useState, useCallback, useEffect } from 'react';
import BaseInput from '@/components/common/BaseInput';
import Button from '@/components/common/Button';

const BirthDateInput = ({ onChange, onClose, initialValue }) => {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValue) {
      // YYYY-MM-DD 또는 YYYYMMDD 형식에서 YYMMDD 추출
      const cleaned = initialValue.replace(/-/g, '');
      setBirthDate(cleaned.slice(-6));
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

  const handleChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setBirthDate(value);
    setError(validateDate(value) ? '' : '유효한 생년월일을 입력해주세요.');
  }, [validateDate]);

  const handleConfirm = useCallback(() => {
    if (!error && birthDate.length === 6) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      
      let fullYear = parseInt(birthDate.slice(0, 2));
      const month = parseInt(birthDate.slice(2, 4));
      const day = parseInt(birthDate.slice(4, 6));

      // 1900년대 또는 2000년대 결정
      if (fullYear + 2000 > currentYear) {
        fullYear += 1900;
      } else {
        fullYear += 2000;
      }

      // 나이 계산
      let age = currentYear - fullYear;
      if (currentMonth < month || (currentMonth === month && currentDay < day)) {
        age--;
      }

      // 나이 범위 확인 (13세 ~ 120세)
      if (age < 13 || age > 120) {
        setError('생년월일은 13세부터 120세까지만 입력 가능합니다.');
        return;
      }

      const formattedDate = `${fullYear}-${birthDate.slice(2, 4)}-${birthDate.slice(4, 6)}`;
      onChange(formattedDate);
      onClose();
    }
  }, [error, birthDate, onChange, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !error && birthDate.length === 6) {
      e.preventDefault();
      handleConfirm();
    }
  }, [handleConfirm, error, birthDate]);

  return (
    <div>
      <BaseInput
        label='생년월일'
        value={birthDate}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='YYMMDD'
        error={error}
        maxLength={6}
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