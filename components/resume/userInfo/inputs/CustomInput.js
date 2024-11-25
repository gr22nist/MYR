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
        label={confirmedValues.title && (
          <div className="user-info-input-label">
            <span>기존 제목:</span>
            <span>{confirmedValues.title}</span>
          </div>
        )}
        id='customTitle'
        value={title}
        onChange={handleTitleChange}
        onEnterPress={handleEnterPress}
        placeholder='제목을 입력하세요'
      />
      <FormInput
        label={confirmedValues.value && (
          <div className="user-info-input-label">
            <span>기존 내용:</span>
            <span>{confirmedValues.value}</span>
          </div>
        )}
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