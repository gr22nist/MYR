import React, { useRef } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { commonStyles } from '@/styles/constLayout';
import { CSSTransition } from 'react-transition-group';

const CareerItem = ({ career, onCareerChange, onDelete, isDeletable, dragHandleProps, className }) => {
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
            <div className="w-label"> {/* 이 div로 감싸서 너비 지정 */}
              <FloatingLabelInput
                label="회사명"
                value={career.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="회사명을 작성해주세요. 예: 네이버 주식회사, Google "
                spellCheck="false"
                maxLength="100"
                className="w-full" // w-full을 사용하여 부모 div의 전체 너비를 차지하도록 함
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
            dragHandleProps={dragHandleProps} 
          />
        </div>

        <div className="flex flex-col gap-2">
          <FloatingLabelInput
            label="직위"
            value={career.position}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder="팀명/직위/포지션을 써주세요"
            spellCheck="false"
            maxLength="100"
            className=""
          />

          <FloatingLabelTextarea
            label="담당업무"
            value={career.tasks}
            onChange={(e) => handleChange('tasks', e.target.value)}
            placeholder={tasksPlaceholder}
            spellCheck="false"
            className={`overflow-hidden resize-none px-4 ${commonStyles.placeholderStyle}`}
          />
        </div>
      </div>
    </CSSTransition>
  );
};

const tasksPlaceholder = `
· 담당 업무에 대해 간단한 서술형 문장으로 작성하시는 것을 추천드립니다.
· 프로젝트 단위의 업무가 흔한 직군이라면 대표 프로젝트에 대한 소개를 추가 해주세요.
· 업무의 성과나 숫자로 나타낼 수 있는 지표가 있다면 활용해보세요.
· 특별한 프로그램이나 사용기술이 있다면 경력기술서 열람에 도움이 됩니다.
`.trim();

export default React.memo(CareerItem);
