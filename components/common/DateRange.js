import { useState, useCallback } from 'react';
import { validateAndFormatDate, isValidDateString, isValidDateOrder } from '@/utils/dateUtils';

const DateRange = ({ 
  onChange, 
  initialStartDate = '', 
  initialEndDate = '', 
  initialIsCurrent = false 
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isCurrent, setIsCurrent] = useState(initialIsCurrent);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartDateChange = (e) => {
    const value = validateAndFormatDate(e.target.value);
    setStartDate(value);
    validateAndUpdate(value, endDate, isCurrent);
  };

  const handleEndDateChange = (e) => {
    const value = validateAndFormatDate(e.target.value);
    setEndDate(value);
    validateAndUpdate(startDate, value, isCurrent);
  };

  const handleCurrentChange = () => {
    const newIsCurrent = !isCurrent;
    setIsCurrent(newIsCurrent);
    setEndDate('');
    validateAndUpdate(startDate, '', newIsCurrent);
  };

  const validateAndUpdate = (start, end, current) => {
    setErrorMessage('');
    
    if ((start && !isValidDateString(start)) || (end && !isValidDateString(end))) {
      setErrorMessage('날짜 형식이 올바르지 않습니다. (YYYY.MM)');
      return;
    }

    if (!current && start && end && !isValidDateOrder(start, end)) {
      setErrorMessage('시작일이 종료일보다 늦을 수 없습니다.');
      return;
    }

    onChange({ startDate: start, endDate: end, isCurrent: current });
  };

  return (
    <div className="date-range-container items-center">
      <div className="date-range-input-group">
        <input
          type="text"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="YYYY.MM"
          className="date-range-input"
        />
        <span className="date-range-separator">-</span>
        <input
          type="text"
          value={isCurrent ? '현재' : endDate}
          onChange={handleEndDateChange}
          placeholder="YYYY.MM"
          className="date-range-input"
          disabled={isCurrent}
        />
      </div>
      <div className="date-range-checkbox-group">
        <label className="date-range-checkbox-wrapper">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={handleCurrentChange}
            className="date-range-checkbox"
          />
          <span className="date-range-checkbox-custom"></span>
          <span className="date-range-checkbox-label">현재</span>
        </label>
      </div>
      {errorMessage && <p className="date-range-error">{errorMessage}</p>}
    </div>
  );
};

export default DateRange;
