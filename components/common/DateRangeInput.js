import React, { useCallback, useMemo } from 'react';
import { useDateRange } from '@/hooks/useDateRange';

const DateRangeInput = ({ 
  onChange, 
  initialStartDate = '', 
  initialEndDate = '', 
  initialIsCurrent = false,
  initialStatus = '',
  showGraduationStatus = false,
}) => {
  const {
    startDate,
    endDate,
    isCurrent,
    errorMessage,
    handleStartDateChange,
    handleEndDateChange,
    handleCurrentChange,
    validateDates,
    status,
    setStatus,
  } = useDateRange(initialStartDate, initialEndDate, initialIsCurrent, initialStatus);

  const handleStatusChange = useCallback((newStatus) => {
    setStatus(newStatus);
    onChange({ startDate, endDate, isCurrent, status: newStatus });
  }, [setStatus, onChange, startDate, endDate, isCurrent]);

  const statusButtonClass = useCallback((buttonStatus) => 
    `date-range-status-button ${status === buttonStatus ? 'date-range-status-button-active' : 'date-range-status-button-inactive'}`
  , [status]);

  return (
    <div className="date-range-container">
      <div className="date-range-input-group">
        <input
          type="text"
          className="date-range-input"
          value={startDate}
          onChange={(e) => {
            handleStartDateChange(e);
            onChange({ startDate: e.target.value, endDate, isCurrent, status });
          }}
          onBlur={validateDates}
          placeholder="202401"
          maxLength="7"
        />
        <span className="date-range-separator">~</span>
        <input
          type="text"
          className={`date-range-input ${isCurrent ? 'date-range-input-current' : ''}`}
          value={isCurrent ? '현재' : endDate}
          onChange={(e) => {
            handleEndDateChange(e);
            onChange({ startDate, endDate: e.target.value, isCurrent, status });
          }}
          onBlur={validateDates}
          placeholder="202401"
          disabled={isCurrent}
          maxLength="7"
        />
        <label className="date-range-checkbox-label">
          <input
            type="checkbox"
            className="date-range-checkbox"
            checked={isCurrent}
            onChange={(e) => {
              handleCurrentChange(e);
              onChange({ startDate, endDate, isCurrent: e.target.checked, status });
            }}
          />
          <span className="date-range-checkbox-text">현재</span>
        </label>
      </div>
      {showGraduationStatus && (
        <div className="date-range-status-group">
          {['졸업', '졸업예정', '재학중'].map((statusOption) => (
            <button 
              key={statusOption}
              className={statusButtonClass(statusOption)}
              onClick={() => handleStatusChange(statusOption)}
            >
              {statusOption}
            </button>
          ))}
        </div>
      )}
      {errorMessage && (
        <p className="date-range-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default React.memo(DateRangeInput);
