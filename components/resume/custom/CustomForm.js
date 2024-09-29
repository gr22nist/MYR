import React, { useMemo } from 'react';
import TagButtons from '@/components/common/TagButtons';
import { PREDEFINED_SECTIONS, CUSTOM_SECTIONS } from '@/constants/resumeConstants';
import useResumeStore from '@/store/resumeStore';

const CustomForm = () => {
  const { addSection, sections } = useResumeStore();

  const tags = useMemo(() => 
    Object.entries(PREDEFINED_SECTIONS).map(([type, label]) => ({ type, label })), 
    []
  );

  const handleAddSection = (type) => {
    const newSection = addSection(type);
    if (newSection) {
      console.log('New section added:', newSection);
    }
  };

  const disabledTags = useMemo(() => {
    return sections
      .filter(section => section.type !== CUSTOM_SECTIONS.type)
      .map(section => section.type);
  }, [sections]);

  return (
    <div className="custom-form mt-4">
      <div className="info-message bg-mono-ee border-l-4 border-mono-33 text-mono-66 font-bold p-4 w-full mb-4">
        <p className="text-sm">
          추가된 항목이 없으면 작성 완료 시 해당 영역이 보이지 않습니다. 
          꼭 필요한 개인정보만 작성해주세요.
        </p>
      </div>
      <div className="flex items-center justify-center bg-white rounded-md p-2 min-h-[60px] w-full">
        <button 
          onClick={() => handleAddSection(CUSTOM_SECTIONS.type)}
          className="bg-secondary-dark text-white px-6 py-4 rounded-md hover:bg-accent-dark transition-colors text-base font-bold flex-shrink-0 mr-2"
        >
          + 자유 서식 추가하기
        </button>
        <TagButtons 
          tags={tags}
          onTagClick={handleAddSection}
          className="flex-wrap justify-center"
          disabledTags={disabledTags}
        />
      </div>
    </div>
  );
};

export default React.memo(CustomForm);