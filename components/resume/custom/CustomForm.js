import React, { useMemo, useCallback } from 'react';
import TagButtons from '@/components/common/TagButtons';
import { PREDEFINED_SECTIONS, CUSTOM_SECTIONS } from '@/constants/resumeConstants';
import useResumeStore from '@/store/resumeStore';
import usecustomStore from '@/store/customStore';
import useResumeSections from '@/hooks/useResumeSections';

const UNIQUE_SECTION_TYPES = ['project', 'award', 'certificate', 'language', 'skill', 'link'];

const CustomForm = ({ onAddSection }) => {
  const { sections } = useResumeStore();
  const { addCustomSection, predefinedSections } = usecustomStore();
  const { loadAllSections } = useResumeSections();

  const tags = useMemo(() => 
    Object.entries(PREDEFINED_SECTIONS).map(([type, label]) => ({ type, label })), 
    []
  );

  const disabledTags = useMemo(() => {
    return Object.keys(predefinedSections);
  }, [predefinedSections]);

  const canAddSection = useCallback((type) => {
    return !UNIQUE_SECTION_TYPES.includes(type) || !predefinedSections[type];
  }, [predefinedSections]);
  
  const handleAddSection = useCallback(async (type) => {
    if (!canAddSection(type)) {
      alert('이 섹션은 이미 추가되어 있습니다.');
      return;
    }
    const newSection = addCustomSection(type);
    await loadAllSections();
  }, [canAddSection, addCustomSection, loadAllSections]);

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
          className="bg-secondary-dark text-white px-6 py-4 rounded-md hover:bg-primary-light transition-colors text-base font-bold flex-shrink-0 mr-2"
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
