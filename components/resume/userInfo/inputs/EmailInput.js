import React, { useState, useCallback, useEffect } from 'react';
import { FormInput } from '@/components/ui/form-input';
import Button from '@/components/common/Button';

const EmailInput = ({ onChange, onClose, initialValue }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [confirmedValue, setConfirmedValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setEmail(initialValue);
      setConfirmedValue(initialValue);
      setError('');
    }
  }, [initialValue]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleChange = useCallback((value) => {
    setEmail(value);
    setError(validateEmail(value) ? '' : '유효한 이메일 주소를 입력해주세요.');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!error && email) {
      setConfirmedValue(email);
      onChange(email);
      onClose();
    }
  }, [error, email, onChange, onClose]);

  const handleEnterPress = useCallback(() => {
    if (!error && email) {
      handleConfirm();
    }
  }, [error, email, handleConfirm]);

  return (
    <div>
      <FormInput
        label={
          <div className="flex justify-between items-center">
            <span>이메일</span>
            {confirmedValue && (
              <span className="text-sm text-gray-500">
                {confirmedValue}
              </span>
            )}
          </div>
        }
        id='email'
        type='email'
        value={email}
        onChange={handleChange}
        onEnterPress={handleEnterPress}
        placeholder='example@example.com'
        error={error}
      />
      <Button
        onClick={handleConfirm}
        disabled={!!error || !email}
        className='mt-4 w-full'
      >
        확인
      </Button>
    </div>
  );
};

export default EmailInput;
