import React, { useRef } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { CSSTransition } from 'react-transition-group';

const EducationItem = ({ education, onEducationChange, onDelete, isDeletable, dragHandleProps, className }) => {
  const nodeRef = useRef(null);

  const handleChange = (field, value) => {
    onEducationChange({ ...education, [field]: value });
  };

  const handleDateChange = ({ startDate, endDate, isCurrent }) => {
    onEducationChange({
      ...education,
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
      <div ref={nodeRef} className={`education-item my-4 relative flex flex-col gap-2 ${className}`}>
        <ActionButtons 
          onDelete={() => onDelete(education.id)} 
          isDeletable={isDeletable} 
          dragHandleProps={dragHandleProps} 
        />

        <div className="flex items-center gap-4">
          <div className="flex-grow max-w-[520px]">
            <FloatingLabelInput
              label="학교명"
              value={education.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="학교명"
              spellCheck="false"
              maxLength="30"
              className=""
              isTitle={true}
            />
          </div>
          <div className="flex items-center space-x-2 mt-2 text-sm">
            {['졸업', '졸업 예정', '재학중'].map((status) => (
              <label key={status} className="text-sm">
                <input
                  type="radio"
                  name={`graduationStatus-${education.id}`}
                  value={status}
                  checked={education.graduationStatus === status}
                  onChange={() => handleChange('graduationStatus', status)}
                /> {status}
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

        <div className="flex flex-col gap-4">
          <FloatingLabelTextarea
            label="전공"
            value={education.major}
            onChange={(e) => handleChange('major', e.target.value)}
            placeholder={majorsPlaceholder}
            spellCheck="false"
          />
        </div>
      </div>
    </CSSTransition>
  );
};

const majorsPlaceholder = `
· 학점이나 긍정적인 특이사항, 교내 활동 등을 어필해보세요.
· 졸업논문이나 수상이력을 포함시키는 것도 좋습니다.
`.trim();

export default React.memo(EducationItem);
