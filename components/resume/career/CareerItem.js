import React, { useRef, useCallback } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { CSSTransition } from 'react-transition-group';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const CareerItem = ({ 
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

  const handleChange = useCallback((field, value) => {
    const updatedCareer = { ...career, [field]: value };
    const isEmpty = Object.entries(updatedCareer).every(([key, v]) => 
      key === 'id' || key === 'order' ||
      v === '' || v === false || v == null || v === undefined || 
      (typeof v === 'object' && Object.keys(v).length === 0)
    );
    console.log('updatedCareer:', updatedCareer, 'isEmpty:', isEmpty);
    if (isEmpty) {
      console.log('Deleting career:', career.id);
      onDelete(career.id);
    } else {
      onCareerChange(updatedCareer);
    }
  }, [career, onCareerChange, onDelete]);

  const handleDateChange = ({ startDate, endDate, isCurrent }) => {
    onCareerChange({
      ...career,
      startDate,
      endDate: isCurrent ? '현재' : endDate,
      isCurrent
    });
  };

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div ref={nodeRef} className={`career-item my-4 relative flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-label">
              <FloatingLabelInput
                label="회사명"
                value={career.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder={PLACEHOLDERS.career.companyName}
                spellCheck="false"
                maxLength="100"
                className="w-full"
                isCore={true}
                isTitle={true}
                tooltipMessage="회사명을 꼭 입력해 주세요."
              />
            </div>
            <DateRangeInput
              onChange={handleDateChange}
              initialStartDate={career.startDate || ''}
              initialEndDate={career.endDate || ''}
              initialIsCurrent={career.isCurrent || false}
              showGraduationStatus={false}
            />
          </div>
          <ActionButtons 
            onDelete={() => onDelete(career.id)} 
            isDeletable={isDeletable} 
            mode="item"
            isSubItem={isSubItem}
            dragHandleProps={dragHandleProps}
          />
        </div>
        {isExpanded && (
          <>
            <FloatingLabelInput
              label="포지션"
              value={career.position || ''}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder={PLACEHOLDERS.career.position}
              spellCheck="false"
              maxLength="100"
              className="w-full"
            />
            <FloatingLabelTextarea
              label="주요 업무"
              value={career.mainTask || ''}
              onChange={(e) => handleChange('mainTask', e.target.value)}
              placeholder={PLACEHOLDERS.career.tasks}
              spellCheck="false"
              maxLength="1000"
              className="w-full"
            />
          </>
        )}
      </div>
    </CSSTransition>
  );
};

export default React.memo(CareerItem);
