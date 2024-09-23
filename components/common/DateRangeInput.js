import React, { useCallback, useMemo } from 'react';
import { commonStyles, combineClasses } from '@/styles/constLayout';
import { useDateRange } from '@/hooks/useDateRange';

const DateRangeInput = ({ 
  onChange, 
  initialStartDate = '', 
  initialEndDate = '', 
  initialIsCurrent = false,
}) => {
  const {
    startDate,
    endDate,
    isCurrent,
    errorMessage,
    handleStartDateChange,
    handleEndDateChange,
    handleCurrentChange,
    validateDates
  } = useDateRange(initialStartDate, initialEndDate, initialIsCurrent, onChange);

  const inputClasses = useMemo(() => combineClasses(
    commonStyles.inputBase,
    commonStyles.focusStyle,
    'w-16'
  ), []);

  const endDateInputClasses = useMemo(() => combineClasses(
    inputClasses,
    isCurrent && 'opacity-50'
  ), [inputClasses, isCurrent]);

  return (
    <div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className={inputClasses}
          value={startDate}
          onChange={handleStartDateChange}
          onBlur={validateDates}
          placeholder="YY.MM"
          maxLength="5"
        />
        <span className="text-gray-500">~</span>
        <input
          type="text"
          className={endDateInputClasses}
          value={isCurrent ? '현재' : endDate}
          onChange={handleEndDateChange}
          onBlur={validateDates}
          placeholder="YY.MM"
          disabled={isCurrent}
          maxLength="5"
        />
        <label className="flex items-center whitespace-nowrap">
          <input
            type="checkbox"
            className="form-checkbox mr-1"
            checked={isCurrent}
            onChange={handleCurrentChange}
          />
          <span className="text-sm">현재</span>
        </label>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default React.memo(DateRangeInput);
