import React, { useRef, useCallback } from 'react';
import DateRange from '@/components/common/DateRange';
import GraduationStatus from '@/components/common/GraduationStatus';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { CSSTransition } from 'react-transition-group';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const EducationItem = React.memo(({ education, onEducationChange, onDelete, isDeletable, dragHandleProps, isSubItem = false, isExpanded, className }) => {
  const nodeRef = useRef(null);

  const handleDateChange = useCallback(({ startDate, endDate, isCurrent }) => {
    onEducationChange({
      ...education,
      startDate,
      endDate,
      isCurrent
    });
  }, [education, onEducationChange]);

  const handleGraduationStatusChange = useCallback((newStatus) => {
    onEducationChange({
      ...education,
      graduationStatus: newStatus
    });
  }, [education, onEducationChange]);

  const handleChange = useCallback((field, value) => {
    onEducationChange({
      ...education,
      [field]: value
    });
  }, [education, onEducationChange]);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      timeout={300}
      classNames='fade'
      appear
    >
      <div ref={nodeRef} className={`resume-item-container ${className}`}>
        <div className='resume-item-header'>
          <div className='resume-item-title'>
            <div className='resume-item-label-container'>
              <FloatingLabelInput
                label='학교명'
                value={education.schoolName || ''}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder={PLACEHOLDERS.education.schoolName}
                spellCheck='false'
                maxLength='100'
                className='w-full'
                isCore={true}
                isTitle={true}
                tooltipMessage='학교명을 꼭 입력해 주세요.'
              />
            </div>
            <div className='flex flex-col lg:flex-row w-full gap-4'>
              <div className='date-range-container'>
                <DateRange
                  onChange={handleDateChange}
                  initialStartDate={education.startDate || ''}
                  initialEndDate={education.endDate || ''}
                  initialIsCurrent={education.isCurrent || false}
                />
              </div>
              <div className='graduation-status-container'>
                <GraduationStatus
                  status={education.graduationStatus || ''}
                  onChange={handleGraduationStatusChange}
                />
              </div>
            </div>
          </div>
          <ActionButtons 
            onDelete={() => onDelete(education.id)} 
            isDeletable={isDeletable} 
            mode='item'
            isSubItem={isSubItem}
            dragHandleProps={dragHandleProps}
          />
        </div>
        {isExpanded && (
          <>
            <FloatingLabelTextarea
              label='전공'
              value={education.major || ''}
              onChange={(e) => handleChange('major', e.target.value)}
              placeholder={PLACEHOLDERS.education.majors}
              spellCheck='false'
              maxLength='100'
              className='w-full mt-4'
            />
          </>
        )}
      </div>
    </CSSTransition>
  );
});

EducationItem.displayName = 'EducationItem';

export default EducationItem;
