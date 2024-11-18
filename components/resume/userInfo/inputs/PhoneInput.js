import React, { useState, useCallback, useEffect } from 'react';
import { FormInput } from '@/components/ui/form-input';
import Button from '@/components/common/Button';

const PhoneInput = ({ onChange, onClose, initialValue }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setPhone(initialValue);
      setConfirmedValue(initialValue);
      setError('');
    }
  }, [initialValue]);

  const validatePhone = (value) => {
    const phoneRegex = /^01[016789]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(value.replace(/-/g, ''));
  };

  const handleChange = useCallback((value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    
    if (numericValue.length <= 3) {
      formattedValue = numericValue;
    } else if (numericValue.length <= 7) {
      formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    } else {
      formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    }
    
    setPhone(formattedValue);
    setError(validatePhone(formattedValue) ? '' : '유효한 휴대폰 번호를 입력해주세요.');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!error && phone) {
      setConfirmedValue(phone);
      onChange(phone);
      onClose();
    }
  }, [error, phone, onChange, onClose]);

  const handleKeyPress = useCallback((e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleEnterPress = useCallback(() => {
    if (!error && phone) {
      handleConfirm();
    }
  }, [error, phone, handleConfirm]);

  return (
    <div>
      <FormInput
        label={
          <div className="flex justify-between items-center">
            <span>연락처</span>
            {confirmedValue && (
              <span className="text-sm text-gray-500">
                {confirmedValue}
              </span>
            )}
          </div>
        }
        id='phone'
        value={phone}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onEnterPress={handleEnterPress}
        placeholder='010-0000-0000'
        error={error}
        maxLength={13}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Button
        onClick={handleConfirm}
        disabled={!!error || !phone}
        className='mt-4 w-full'
      >
        확인
      </Button>
    </div>
  );
};

export default PhoneInput;