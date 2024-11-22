import React, { useRef, useCallback } from 'react';
import DateRange from '@/components/common/DateRange';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { CSSTransition } from 'react-transition-group';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const CareerItem = React.memo(({ 
  career, 
  onCareerChange, 
  onDelete, 
  isDeletable, 
  dragHandleProps, 
  isSubItem = false,
  isExpanded,
  className = ''
}) => {
  const nodeRef = useRef(null);

  const handleDateChange = useCallback(({ startDate, endDate, isCurrent }) => {
    onCareerChange({
      ...career,
      startDate,
      endDate: isCurrent ? '현재' : endDate,
      isCurrent
    });
  }, [career, onCareerChange]);

  const handleChange = useCallback((field, value) => {
    const updatedCareer = { ...career, [field]: value };
    const isEmpty = Object.entries(updatedCareer).every(([key, v]) => 
      key === 'id' || 
      key === 'order' ||
      key === 'startDate' ||
      key === 'endDate' ||
      key === 'isCurrent' ||
      v === '' || 
      v === false || 
      v == null || 
      v === undefined || 
      (typeof v === 'object' && Object.keys(v).length === 0)
    );

    if (isEmpty) {
      onDelete(career.id);
    } else {
      onCareerChange(updatedCareer);
    }
  }, [career, onCareerChange, onDelete]);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      timeout={300}
      classNames='fade'
      appear
    >
      <div ref={nodeRef} className={`resume-item-container ${className}`}>
        <ActionButtons 
          onDelete={() => onDelete(career.id)} 
          isDeletable={isDeletable} 
          mode='item'
          isSubItem={isSubItem}
          dragHandleProps={dragHandleProps}
          className='action-buttons'
        />
        <div className='resume-item-header'>
          <div className='resume-item-title'>
            <div className='resume-item-label-container'>
              <FloatingLabelInput
                label='회사명'
                value={career.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder={PLACEHOLDERS.career.companyName}
                spellCheck='false'
                maxLength='50'
                className='w-full'
                isCore={true}
                isTitle={true}
                tooltipMessage='회사명을 꼭 입력해 주세요.'
              />
            </div>
            <div className='date-status-container'>
              <DateRange
                onChange={handleDateChange}
                initialStartDate={career.startDate || ''}
                initialEndDate={career.endDate || ''}
                initialIsCurrent={career.isCurrent || false}
                showGraduationStatus={false}
                formatDate={(date) => {
                  if (!date) return '';
                  const [year, month] = date.split('-');
                  return `${year}.${month}`;
                }}
              />
            </div>
          </div>
        </div>
        {isExpanded && (
          <>
          <FloatingLabelInput
            label='포지션'
            value={career.position || ''}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder={PLACEHOLDERS.career.position}
            spellCheck='false'
            maxLength='100'
            className='w-full'
          />
          <FloatingLabelTextarea
            label='주요 업무'
            value={career.mainTask || ''}
            onChange={(e) => handleChange('mainTask', e.target.value)}
            placeholder={PLACEHOLDERS.career.mainTask}
            spellCheck='false'
            maxLength='1000'
            className='w-full'
            />
          </>
        )}
      </div>
    </CSSTransition>
  );
});

CareerItem.displayName = 'CareerItem';

export default CareerItem;
