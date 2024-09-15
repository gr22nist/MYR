import React, { useState, useRef, useEffect } from 'react';
import InputField from '@/components/common/InputField';

const CareerItem = ({ index, onCareerChange, career, onDelete, isDeletable }) => {
  const [companyName, setCompanyName] = useState(career.companyName || '');
  const [position, setPosition] = useState(career.position || '');
  const [period, setPeriod] = useState(career.period || '');
  const [tasks, setTasks] = useState(career.tasks || '');
  const tasksRef = useRef(null);

  const handleTasksChange = (value) => {
    setTasks(value);
    onCareerChange(index, { ...career, tasks: value });
  };

  useEffect(() => {
    if (tasksRef.current) {
      tasksRef.current.style.height = 'auto';
      tasksRef.current.style.height = `${tasksRef.current.scrollHeight}px`;
    }
  }, [tasks]);

  return (
    <div className="career-item my-4 p-4 border-b relative">
      {/* 아이콘들을 좌측 상단에 배치 */}
      <div className="absolute top-0 left-0 flex flex-col items-center space-y-2">
        {/* 드래그 아이콘 */}
        <div className="cursor-grab w-6 h-6 bg-gray-200 flex items-center justify-center rounded-full">
          <span className="text-gray-500">⠿</span>
        </div>
        {/* 삭제 버튼 */}
        {isDeletable && (
          <button
            onClick={() => onDelete(index)}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            X
          </button>
        )}
      </div>

      <InputField
        label="회사명"
        value={companyName}
        onChange={(value) => {
          setCompanyName(value);
          onCareerChange(index, { ...career, companyName: value });
        }}
        placeholder="회사명"
        className="flex-grow"
      />
      <InputField
        label="직위"
        value={position}
        onChange={(value) => {
          setPosition(value);
          onCareerChange(index, { ...career, position: value });
        }}
        placeholder="직위"
      />
      <InputField
        label="근무 기간"
        value={period}
        onChange={(value) => {
          setPeriod(value);
          onCareerChange(index, { ...career, period: value });
        }}
        placeholder="근무 기간 (예: 2022.02-재직중)"
      />

      <div className="my-2">
        <strong>담당 업무</strong>
        <textarea
          ref={tasksRef}
          className="w-full text-sm p-2 border rounded overflow-hidden mt-2"
          value={tasks}
          onChange={(e) => handleTasksChange(e.target.value)}
          placeholder="담당 업무를 입력하세요. 각 항목은 새 줄에 작성하세요."
          rows="2"
          style={{ resize: 'none', minHeight: '60px' }}
        />
      </div>
    </div>
  );
};

export default CareerItem;
