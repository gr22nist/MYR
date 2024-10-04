import React from 'react';
import TagButtons from '@/components/common/TagButtons';

const AddSection = ({ tags, activeField, setActiveField, setIsCustomModalOpen, disabledTags }) => {
  return (
    <div className="w-full p-4 flex flex-col gap-6 items-center border rounded-lg bg-gray-50">
      <div className="info-message bg-mono-ee border-l-4 border-mono-33 text-mono-66 font-bold p-4 w-full">
        <p className="text-sm">
          작성이 필요한 개인정보(병역 유무, 성별, 나이 등)가 있는 경우에는 자유서식을 사용해보세요. 
          추가된 항목이 없으면 작성 완료 시 해당 영역이 보이지 않습니다.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button 
          onClick={() => setIsCustomModalOpen(true)}
          className="bg-secondary-dark text-white px-6 py-4 rounded-md hover:bg-accent-dark transition-colors text-base font-bold flex-shrink-0"
        >
          + 개인정보 자유 서식
        </button>
        
        <div className="flex items-center justify-center bg-white rounded-md p-2 min-h-[60px]">
          <TagButtons 
            tags={tags}
            activeTag={activeField?.type}
            onTagClick={(type) => setActiveField({ type, id: null })}
            disabledTags={disabledTags}
            className="flex-wrap justify-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AddSection;
