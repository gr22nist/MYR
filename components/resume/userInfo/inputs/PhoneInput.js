import React, { useState, useCallback, useEffect } from 'react';
import BaseInput from '@/components/common/BaseInput';
import Button from '@/components/common/Button';

const PhoneInput = ({ onChange, onClose, initialValue }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValue) {
      setPhone(initialValue);
      setError('');
    }
  }, [initialValue]);

  const validatePhone = (value) => {
    const phoneRegex = /^01[016789]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(value.replace(/-/g, ''));
  };

  const handleChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    if (value.length <= 3) {
      formattedValue = value;
    } else if (value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setPhone(formattedValue);
    setError(validatePhone(formattedValue) ? '' : '유효한 휴대폰 번호를 입력해주세요.');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!error && phone) {
      onChange(phone);
      onClose();
    }
  }, [error, phone, onChange, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !error && phone) {
      e.preventDefault();
      handleConfirm();
    }
  }, [handleConfirm, error, phone]);

  return (
    <div>
      <BaseInput
        label="연락처"
        value={phone}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="010-0000-0000"
        error={error}
      />
      <Button
        onClick={handleConfirm}
        disabled={!!error || !phone}
        className="mt-4 w-full"
      >
        확인
      </Button>
    </div>
  );
};

export default PhoneInput;