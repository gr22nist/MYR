import React, { useRef, useCallback } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { CSSTransition } from 'react-transition-group';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const EducationItem = React.memo(({ education, onEducationChange, onDelete, isDeletable, dragHandleProps, isSubItem = false, isExpanded, className }) => {
  const nodeRef = useRef(null);

  const handleChange = useCallback((field, value) => {
    const updatedEducation = { ...education, [field]: value };
    const isEmpty = Object.entries(updatedEducation).every(([key, v]) => 
      key === 'id' || key === 'order' || key === 'graduationStatus' ||
      v === '' || v === false || v == null || v === undefined || 
      (typeof v === 'object' && Object.keys(v).length === 0)
    );
    console.log('updatedEducation:', updatedEducation, 'isEmpty:', isEmpty);
    if (isEmpty) {
      console.log('Deleting education:', education.id);
      onDelete(education.id);
    } else {
      onEducationChange(updatedEducation);
    }
  }, [education, onEducationChange, onDelete]);

  const handleDateChange = useCallback(({ startDate, endDate, isCurrent, status }) => {
    onEducationChange({
      ...education,
      startDate,
      endDate: isCurrent ? '현재' : endDate,
      isCurrent,
      graduationStatus: status
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
          <div className="flex gap-4 items-center">
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
            <DateRangeInput
              onChange={handleDateChange}
              initialStartDate={education.startDate || ''}
              initialEndDate={education.endDate || ''}
              initialIsCurrent={education.isCurrent || false}
              initialStatus={education.graduationStatus || ''}
              showGraduationStatus={true}
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
