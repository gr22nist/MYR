import React, { useMemo } from 'react';
import TagButtons from '@/components/common/TagButtons';
import { PREDEFINED_SECTIONS, CUSTOM_SECTIONS } from '@/constants/resumeConstants';
import useResumeStore from '@/store/resumeStore';

const CustomForm = ({ onAddSection }) => {
  const { sections, predefinedSections } = useResumeStore();

  const tags = useMemo(() => 
    Object.entries(PREDEFINED_SECTIONS).map(([type, label]) => ({ type, label })), 
    []
  );

  const handleAddSection = (type) => {
    console.log('Adding section of type:', type);
    onAddSection(type);
  };

  const disabledTags = useMemo(() => {
    return sections
      .filter(section => section && section.type !== CUSTOM_SECTIONS.type)
      .map(section => section.type);
  }, [sections]);

  // 유니크한 섹션 타입 목록
  const uniqueSectionTypes = ['project', 'award', 'certificate', 'language', 'skill', 'link'];

  // 유니크한 섹션 타입인지 확인하는 함수
  const isUniqueSection = (type) => uniqueSectionTypes.includes(type);

  // 섹션 추가 가능 여부를 확인하는 함수
  const canAddSection = (type) => {
    if (isUniqueSection(type)) {
      return !sections.some(section => section.type === type);
    }
    return true;
  };

  return (
    <div className="custom-form mt-4">
      <div className="info-message bg-mono-ee border-l-4 border-mono-33 text-mono-66 font-bold p-4 w-full mb-4">
        <p className="text-sm">
          작성하고 싶은 정보가 있는데 작성란이 없으셨나요? 직접 만들어보세요.
          저서, 논문, 봉사경험 등 무엇이든 간단한 텍스트로 작성 가능합니다.
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
          onTagClick={(type) => {
            if (canAddSection(type)) {
              handleAddSection(type);
            } else {
              console.log(`Cannot add more than one ${type} section`);
              // 여기에 사용자에게 알림을 주는 로직을 추가할 수 있습니다.
            }
          }}
          className="flex-wrap justify-center"
          disabledTags={disabledTags}
        />
      </div>
    </div>
  );
};

export default React.memo(CustomForm);