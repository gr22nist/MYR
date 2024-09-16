import React from 'react';
import InputField from '../../common/InputField';

const EducationItem = ({ education, onEducationChange, onDelete, isDeletable }) => {
  const handleChange = (field, value) => {
    onEducationChange(education.id, { [field]: value });
  };

  return (
    <div className="education-item my-4 p-4 border-b relative">
      {/* 아이콘들을 좌측 상단에 배치 */}
      <div className="absolute top-0 left-0 flex flex-col items-center space-y-2">
        {/* 드래그 아이콘 */}
        <div className="cursor-grab w-6 h-6 bg-gray-200 flex items-center justify-center rounded-full">
          <span className="text-gray-500">⠿</span>
        </div>
        {/* 삭제 버튼 */}
        {isDeletable && (
          <button
            onClick={() => onDelete(education.id)}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            X
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <InputField
          label="학교명"
          value={education.schoolName}
          onChange={(value) => handleChange('schoolName', value)}
          placeholder="학교명"
          className="flex-grow"
          spellCheck="false"
        />

        {/* 라디오 버튼 */}
        <div className="flex items-center space-x-2">
          {['재학중', '졸업 예정', '졸업'].map((status) => (
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
      </div>

      <InputField
        label="전공"
        value={education.major}
        onChange={(value) => handleChange('major', value)}
        placeholder="전공"
        spellCheck="false"
      />
      <InputField
        label="기간"
        value={education.period}
        onChange={(value) => handleChange('period', value)}
        placeholder="기간 (예: 2016-2020)"
        inputStyle="w-1/2"
        spellCheck="false"
      />
    </div>
  );
};

export default EducationItem;
