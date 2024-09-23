import { useState, useCallback, useEffect } from 'react';
import { validateAndFormatDate, isValidDateOrder } from '@/utils/dateUtils';

const ERROR_MESSAGE = '종료일이 시작일보다 빠를 수 없습니다.';

export const useDateRange = (initialStartDate = '', initialEndDate = '', initialIsCurrent = false) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isCurrent, setIsCurrent] = useState(initialIsCurrent);
  const [errorMessage, setErrorMessage] = useState('');

  const validateDates = useCallback(() => {
    if (startDate && endDate && !isValidDateOrder(startDate, endDate)) {
      setErrorMessage(ERROR_MESSAGE);
      return false;
    }
    setErrorMessage('');
    return true;
  }, [startDate, endDate]);

  const handleStartDateChange = useCallback((e) => {
    const newStartDate = validateAndFormatDate(e.target.value);
    setStartDate(newStartDate);
  }, []);

  const handleEndDateChange = useCallback((e) => {
    const newEndDate = validateAndFormatDate(e.target.value);
    setEndDate(newEndDate);
  }, []);

  const handleCurrentChange = useCallback((e) => {
    const newIsCurrent = e.target.checked;
    setIsCurrent(newIsCurrent);
    if (newIsCurrent) {
      setEndDate('');
    }
  }, []);

  useEffect(() => {
    validateDates();
  }, [startDate, endDate, validateDates]);

  return {
    startDate,
    endDate,
    isCurrent,
    errorMessage,
    handleStartDateChange,
    handleEndDateChange,
    handleCurrentChange,
    validateDates
  };
};
