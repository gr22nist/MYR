import React, { useCallback, useMemo } from 'react';
import { common, combineClasses } from '@/styles/constLayout';
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
  } = useDateRange(initialStartDate, initialEndDate, initialIsCurrent);

  const inputClasses = useMemo(() => combineClasses(
    common.inputBase,
    common.focusStyle,
    'w-[88px]'
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
          onChange={(e) => {
            handleStartDateChange(e);
            onChange({ startDate: e.target.value, endDate, isCurrent });
          }}
          onBlur={validateDates}
          placeholder="202401"
          maxLength="7"
        />
        <span className="text-gray-500">~</span>
        <input
          type="text"
          className={endDateInputClasses}
          value={isCurrent ? '현재' : endDate}
          onChange={(e) => {
            handleEndDateChange(e);
            onChange({ startDate, endDate: e.target.value, isCurrent });
          }}
          onBlur={validateDates}
          placeholder="202401"
          disabled={isCurrent}
          maxLength="7"
        />
        <label className="flex items-center whitespace-nowrap">
          <input
            type="checkbox"
            className="form-checkbox mr-1"
            checked={isCurrent}
            onChange={(e) => {
              handleCurrentChange(e);
              onChange({ startDate, endDate, isCurrent: e.target.checked });
            }}
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