import React, { useRef, useCallback, useMemo } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { radio } from '@/styles/constLayout';
import { CSSTransition } from 'react-transition-group';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const EducationItem = React.memo(({ education, onEducationChange, onDelete, isDeletable, dragHandleProps, isSubItem = false, isExpanded, className }) => {
  const nodeRef = useRef(null);
  
  const radioGroupName = useMemo(() => `graduationStatus-${education.id}`, [education.id]);

  const handleChange = useCallback((field, value) => {
    onEducationChange({ ...education, [field]: value });
  }, [education, onEducationChange]);

  const handleDateChange = useCallback(({ startDate, endDate, isCurrent }) => {
    onEducationChange({
      ...education,
      startDate,
      endDate: isCurrent ? '현재' : endDate,
      isCurrent
    });
  }, [education, onEducationChange]);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      timeout={300}
      classNames="fade"
      appear
    >
      <div ref={nodeRef} className={`education-item my-4 relative flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-label">
              <FloatingLabelInput
                label="학교명"
                value={education.schoolName || ''}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder={PLACEHOLDERS.education.schoolName}
                spellCheck="false"
                maxLength="100"
                className="w-full"
                isCore={true}
                isTitle={true}
                tooltipMessage="학교명을 꼭 입력해 주세요."
              />
            </div>
            <div className="flex items-center space-x-2 mt-2 text-sm">
              {['졸업', '졸업 예정', '재학중'].map((status) => (
                <label key={status} className={radio.radioLabel}>
                  <input
                    type="radio"
                    name={radioGroupName}
                    value={status}
                    checked={education.graduationStatus === status}
                    onChange={() => handleChange('graduationStatus', status)}
                    className={radio.radioInput}
                  />
                  <span className={radio.radioText}>{status}</span>
                </label>
              ))}
            </div>
            <DateRangeInput
              onChange={handleDateChange}
              initialStartDate={education.startDate || ''}
              initialEndDate={education.endDate || ''}
              initialIsCurrent={education.isCurrent || false}
            />
          </div>
          <ActionButtons 
            onDelete={() => onDelete(education.id)} 
            isDeletable={isDeletable} 
            mode="item"
            isSubItem={isSubItem}
            dragHandleProps={dragHandleProps}
          />
        </div>
        {isExpanded && (
          <>
            <FloatingLabelTextarea
              label="전공"
              value={education.major || ''}
              onChange={(e) => handleChange('major', e.target.value)}
              placeholder={PLACEHOLDERS.education.majors}
              spellCheck="false"
              maxLength="100"
              className="w-full"
            />
          </>
        )}
      </div>
    </CSSTransition>
  );
});

EducationItem.displayName = 'EducationItem';

export default EducationItem;
