import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCustomSection } from '@/redux/slices/customSectionSlice';
import CustomSectionItem from './CustomItem';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import DateRangeInput from '@/components/common/DateRangeInput';

const CustomSectionForm = () => {
  const dispatch = useDispatch();
  const customSections = useSelector(state => state.customSections.sections);
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({});

  const predefinedSections = {
    project: '프로젝트',
    award: '수상 경력',
    certificate: '자격증',
    language: '외국어',
    skill: '보유 기술',
    link: '링크'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSection = () => {
    if (!activeField) return;

    const newSection = {
      id: Date.now(),
      type: activeField,
      ...formData
    };
    dispatch(saveCustomSection(newSection));
    setActiveField(null);
    setFormData({});
  };

  const renderSectionForm = () => {
    switch(activeField) {
      case 'project':
        return (
          <div>
            <TextInput label="프로젝트명" onChange={(value) => handleInputChange('title', value)} />
            <TextAreaInput label="설명" onChange={(value) => handleInputChange('description', value)} />
            <DateRangeInput label="기간" onChange={(value) => handleInputChange('period', value)} />
          </div>
        );
      case 'award':
        return (
          <div>
            <TextInput label="수상명" onChange={(value) => handleInputChange('title', value)} />
            <TextInput label="수여 기관" onChange={(value) => handleInputChange('organization', value)} />
            <DateRangeInput label="수상 일자" onChange={(value) => handleInputChange('date', value)} />
          </div>
        );
      // 다른 predefined 섹션들에 대한 폼도 여기에 추가...
      default:
        return (
          <div>
            <TextInput label="제목" onChange={(value) => handleInputChange('title', value)} />
            <TextAreaInput label="내용" onChange={(value) => handleInputChange('content', value)} />
          </div>
        );
    }
  };

  return (
    <div className="custom-section flex flex-col justify-center items-center">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => setActiveField('custom')}
          className="add-section-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <span className="plus-icon">+</span> 자유서식 추가하기
        </button>
      </div>
      
      <div className="tags-container flex flex-wrap gap-2 mb-4">
        <span className='tag px-3 py-2 rounded-md transition-colors'>추천태그: </span>
        {Object.entries(predefinedSections).map(([type, label]) => (
          <button 
            key={type}
            onClick={() => setActiveField(type)}
            className={`tag px-3 py-2 rounded-md transition-colors ${
              activeField === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            #{label}
          </button>
        ))}
      </div>
      
      <p className="info-message text-sm text-gray-600 mb-4">
        자유서식을 추가하여 이력서를 더욱 풍성하게 만들어보세요.
      </p>

      {activeField && (
        <div className="form-container mb-4">
          {renderSectionForm()}
          <button 
            onClick={handleAddSection}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mt-4"
          >
            추가
          </button>
        </div>
      )}

      <div className="w-full sections-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customSections.map((section) => (
          <CustomSectionItem 
            key={section.id}
            section={section}
            onRemove={() => handleRemoveSection(section.id)}
            onEdit={() => setActiveField(section.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomSectionForm;
