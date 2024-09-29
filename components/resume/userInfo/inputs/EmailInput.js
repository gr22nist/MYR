import React, { useState, useCallback, useEffect } from 'react';
import BaseInput from '@/components/common/BaseInput';
import Button from '@/components/common/Button';

const EmailInput = ({ onChange, onClose, initialValue }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValue) {
      setEmail(initialValue);
      setError('');
    }
  }, [initialValue]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setEmail(value);
    setError(validateEmail(value) ? '' : '유효한 이메일 주소를 입력해주세요.');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!error && email) {
      onChange(email);
      onClose();
    }
  }, [error, email, onChange, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !error && email) {
      e.preventDefault();
      handleConfirm();
    }
  }, [handleConfirm, error, email]);

  return (
    <div>
      <BaseInput
        label="이메일"
        id="email"
        type="email"
        value={email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="example@example.com"
        error={error}
      />
      <Button
        onClick={handleConfirm}
        disabled={!!error || !email}
        className="mt-4 w-full"
      >
        확인
      </Button>
    </div>
  );
};

export default EmailInput;
