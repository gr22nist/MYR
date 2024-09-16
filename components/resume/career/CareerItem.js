import React from 'react';
import InputField from '@/components/common/InputField';

const CareerItem = ({ career, onCareerChange, onDelete, isDeletable }) => {
  const handleChange = (field, value) => {
    const updatedCareer = { ...career, [field]: value };
    onCareerChange(updatedCareer);
  };

  return (
    <div className="career-item my-4 p-4 border-b relative">
      <div className="absolute top-0 left-0 flex flex-col items-center space-y-2">
        <div className="cursor-grab w-6 h-6 bg-gray-200 flex items-center justify-center rounded-full">
          <span className="text-gray-500">⠿</span>
        </div>
        {isDeletable && (
          <button
            onClick={() => onDelete(career.id)}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            X
          </button>
        )}
      </div>

      <InputField
        label="회사명"
        value={career.companyName}
        onChange={(value) => handleChange('companyName', value)}
        placeholder="회사명"
        className="flex-grow"
        spellCheck="false"
      />
      <InputField
        label="직위"
        value={career.position}
        onChange={(value) => handleChange('position', value)}
        placeholder="직위"
        spellCheck="false"
      />
      <InputField
        label="근무 기간"
        value={career.period}
        onChange={(value) => handleChange('period', value)}
        placeholder="근무 기간 (예: 2022.02-재직중)"
        spellCheck="false"
      />

      <div className="my-2">
        <strong>담당 업무</strong>
        <textarea
          className="w-full text-sm p-2 border rounded overflow-hidden mt-2"
          value={career.tasks}
          onChange={(e) => handleChange('tasks', e.target.value)}
          placeholder="담당 업무를 입력하세요. 각 항목은 새 줄에 작성하세요."
          rows="2"
          style={{ resize: 'none', minHeight: '60px' }}
        />
      </div>
    </div>
  );
};

export default CareerItem;
