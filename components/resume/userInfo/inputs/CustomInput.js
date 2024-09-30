import React, { useState, useCallback, useEffect } from 'react';
import BaseInput from '@/components/common/BaseInput';
import Button from '@/components/common/Button';

const CustomInput = ({ onChange, onClose, initialValue }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title || '');
      setValue(initialValue.value || '');
    }
  }, [initialValue]);

  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const handleValueChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleConfirm = useCallback(() => {
    if (title && value) {
      onChange(title, value);
      onClose();
    }
  }, [title, value, onChange, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && title && value) {
      e.preventDefault();
      handleConfirm();
    }
  }, [handleConfirm, title, value]);

  return (
    <div>
      <BaseInput
        label="제목"
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
        onKeyDown={handleKeyDown}
      />
      <BaseInput
        label="내용"
        value={value}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="내용을 입력하세요"
      />
      <Button
        onClick={handleConfirm}
        disabled={!title || !value}
        className="mt-4 w-full"
      >
        확인
      </Button>
    </div>
  );
};

export default CustomInput;