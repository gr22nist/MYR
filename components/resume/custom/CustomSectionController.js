import React, { useMemo } from 'react';
import TagButtons from '@/components/common/TagButtons';
import { PREDEFINED_SECTIONS, CUSTOM_SECTIONS } from '@/constants/resumeConstants';
import useCustomStore from '@/store/customStore';

const CustomSectionController = ({ onAddSection }) => {
  const { customSections } = useCustomStore();

  const handleAddSection = (type) => {
    if (type !== CUSTOM_SECTIONS.type && customSections.some(section => section.type === type)) {
      return;
    }

    const newSection = {
      id: Date.now(),
      type,
      title: type === CUSTOM_SECTIONS.type ? CUSTOM_SECTIONS.title : PREDEFINED_SECTIONS[type],
      content: ''
    };
    onAddSection(newSection);
  };

  const tags = useMemo(() => 
    Object.entries(PREDEFINED_SECTIONS).map(([type, label]) => ({ type, label })), 
    []
  );

  const disabledTags = useMemo(() => 
    Object.keys(PREDEFINED_SECTIONS).filter(type => 
      customSections.some(section => section.type === type)
    ),
    [customSections]
  );

  return (
    <div className="custom-form">
      <InfoMessage />
      <SectionControls 
        onAddCustom={() => handleAddSection(CUSTOM_SECTIONS.type)}
        tags={tags}
        onTagClick={handleAddSection}
        disabledTags={disabledTags}
      />
    </div>
  );
};

const InfoMessage = () => (
  <div className="w-full py-3 px-2 flex flex-col gap-6 items-center border rounded-lg bg-gray-50">
    <div className="info-message bg-mono-ee border-l-4 border-mono-33 text-mono-66 font-bold p-4 w-full">
      <p className="text-sm">
        추가된 항목이 없으면 작성 완료 시 해당 영역이 보이지 않습니다. 
        꼭 필요한 개인정보만 작성해주세요.
      </p>
    </div>
  </div>
);

const SectionControls = ({ onAddCustom, tags, onTagClick, disabledTags }) => (
  <div className="flex items-center justify-center bg-white rounded-md p-2 min-h-[60px] w-full">
    <button 
      onClick={onAddCustom}
      className="bg-secondary-dark text-white px-6 py-4 rounded-md hover:bg-accent-dark transition-colors text-base font-bold flex-shrink-0"
    >
      + 자유 서식 추가하기
    </button>
    <TagButtons 
      tags={tags}
      onTagClick={onTagClick}
      disabledTags={disabledTags}
      className="flex-wrap justify-center"
    />
  </div>
);

export default CustomSectionController;
