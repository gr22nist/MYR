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
    <div className='controls-container'>
      <div className='info-message text-small'>
        작성하고 싶은 정보가 있는데 필드가 없나요? 직접 만들어보세요.
        저서, 논문, 봉사 경험, 교육활동 등 무엇이든 간단한 텍스트로 작성 가능합니다.
      </div>
      <div className='controls'>
        <button 
          onClick={() => handleAddSection(CUSTOM_SECTIONS.type)}
          className='controls-custom-btn'
        >
          + 자유 서식 추가하기
        </button>
        <div className='control-type-btn'>
          <TagButtons 
            tags={tags}
            onTagClick={handleAddSection}
            disabledTags={disabledTags}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CustomForm);
