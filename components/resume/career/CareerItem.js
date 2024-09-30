import React, { useRef } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { commonStyles } from '@/styles/constLayout';
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

  const handleChange = (field, value) => {
    onCareerChange({ ...career, [field]: value });
  };

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
          <div className="flex items-center">
            <div className="w-label">
              <FloatingLabelInput
                label="회사명"
                value={career.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="예: 네이버 주식회사, Google "
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
              label="직책"
              value={career.position || ''}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="직책을 작성해주세요. 예: 프론트엔드 개발자, UX 디자이너"
              spellCheck="false"
              maxLength="100"
              className="w-full"
            />
            <FloatingLabelTextarea
              label="주요 업무"
              value={career.mainTask || ''}
              onChange={(e) => handleChange('mainTask', e.target.value)}
              placeholder={PLACEHOLDERS.CAREER_MAIN_TASK}
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
