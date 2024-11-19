import React, { useState, useCallback, useEffect } from 'react';
import { FormInput } from '@/components/ui/form-input';
import Button from '@/components/common/Button';

const CustomInput = ({ onChange, onClose, initialValue }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [confirmedValues, setConfirmedValues] = useState({ title: '', value: '' });

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title || '');
      setValue(initialValue.value || '');
      setConfirmedValues(initialValue);
    }
  }, [initialValue]);

  const handleTitleChange = useCallback((value) => {
    setTitle(value);
  }, []);

  const handleValueChange = useCallback((value) => {
    setValue(value);
  }, []);

  const handleConfirm = useCallback(() => {
    if (title && value) {
      const newValues = { title, value };
      setConfirmedValues(newValues);
      onChange(title, value);
      onClose();
    }
  }, [title, value, onChange, onClose]);

  const handleEnterPress = useCallback(() => {
    if (title && value) {
      handleConfirm();
    }
  }, [title, value, handleConfirm]);

  return (
    <div className='custom-container'>
      <FormInput
        label={
          <div className="flex justify-between items-center">
            <span>제목</span>
            {confirmedValues.title && (
              <span className="text-sm text-gray-500">
                {confirmedValues.title}
              </span>
            )}
          </div>
        }
        id='customTitle'
        value={title}
        onChange={handleTitleChange}
        onEnterPress={handleEnterPress}
        placeholder='제목을 입력하세요'
      />
      <FormInput
        label={
          <div className="flex justify-between items-center">
            <span>내용</span>
            {confirmedValues.value && (
              <span className="text-sm text-gray-500">
                {confirmedValues.value}
              </span>
            )}
          </div>
        }
        id='customValue'
        value={value}
        onChange={handleValueChange}
        onEnterPress={handleEnterPress}
        placeholder='내용을 입력하세요'
      />
      <Button
        onClick={handleConfirm}
        disabled={!title || !value}
        className='mt-4 w-full'
      >
        확인
      </Button>
    </div>
  );
};

export default CustomInput;