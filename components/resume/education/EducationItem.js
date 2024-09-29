import React, { useRef, useCallback } from 'react';
import DateRangeInput from '@/components/common/DateRangeInput';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { commonStyles } from '@/styles/constLayout';
import { CSSTransition } from 'react-transition-group';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const EducationItem = React.memo(({ education, onEducationChange, onDelete, isDeletable, dragHandleProps, className }) => {
  const nodeRef = useRef(null);

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
          <div className="flex gap-4">
            <div className="w-label">
              <FloatingLabelInput
                label="학교명"
                value={education.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder="학교명을 작성해주세요. 예: 서울대학교, 한양대학교"
                spellCheck="false"
                maxLength="30"
                className="w-[520px]"
                isCore={true}
                isTitle={true}
                tooltipMessage="학교명을 꼭 입력해 주세요."
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
              <DateRangeInput
                onChange={handleDateChange}
                initialStartDate={education.startDate || ''}
                initialEndDate={education.endDate || ''}
                initialIsCurrent={education.isCurrent || false}
              />
            </div>
          </div>
          <ActionButtons 
            onDelete={() => onDelete(education.id)} 
            isDeletable={isDeletable} 
            dragHandleProps={dragHandleProps}
            isSubItem={true}
          />
        </div>

        <div className="flex flex-col gap-4">
          <FloatingLabelInput
            label="학과"
            value={education.department}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="학부/학과명을 작성해주세요. 예: 전산학부 컴퓨터공학과"
            spellCheck="false"
            maxLength="100"
            className=""
          />
          <FloatingLabelTextarea
            label="전공"
            value={education.major}
            onChange={(e) => handleChange('major', e.target.value)}
            placeholder={PLACEHOLDERS.education.majors}
            spellCheck="false"
            className={`overflow-hidden resize-none px-4 ${commonStyles.placeholderStyle}`}
          />
        </div>
      </div>
    </CSSTransition>
  );
});

EducationItem.displayName = 'EducationItem';

export default EducationItem;
