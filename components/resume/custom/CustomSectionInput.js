import React, { useState, useRef, useEffect } from 'react';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import ActionButtons from '@/components/common/actions/ActionBtns';
import { commonStyles } from '@/styles/constLayout';
import LinkItems from './LinkItems';

const CustomSectionInput = ({ type, section, onSectionChange, onDelete, isDeletable, dragHandleProps, className }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef(null);
  const sectionRef = useRef(null);

  const handleChange = (field, value) => {
    onSectionChange({ ...section, [field]: value });
  };

  const isCustomType = type === 'custom';

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(section?.id), 300);
  };

  useEffect(() => {
    if (isDeleting && sectionRef.current) {
      sectionRef.current.style.maxHeight = '0px';
      sectionRef.current.style.opacity = '0';
    }
  }, [isDeleting]);

  const getPlaceholder = () => {
    switch (section.title) {
      case '프로젝트':
        return projectPlaceholder;
      case '수상':
        return awardPlaceholder;
      case '자격증':
        return certificationPlaceholder;
      case '어학':
        return languagePlaceholder;
      case '활동':
        return activityPlaceholder;
      default:
        return defaultPlaceholder;
    }
  };

  const handleLinkChange = (newLinks) => {
    handleChange('links', newLinks);
  };

  const renderContent = () => {
    if (section.title === '링크') {
      return (
        <LinkItems
          links={section.links || []}
          onChange={handleLinkChange}
        />
      );
    } else {
      return (
        <FloatingLabelTextarea
          label="내용"
          value={section?.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder={getPlaceholder()}
          spellCheck="false"
          className={`overflow-hidden resize-none px-4 ${commonStyles.placeholderStyle}`}
        />
      );
    }
  };

  return (
    <div ref={sectionRef} className={`bg-white rounded-lg shadow-md ${className} ${isDeleting ? 'deleting' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {isCustomType ? (
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none"
            placeholder="섹션 제목"
          />
        ) : (
          <h3 className="text-lg font-semibold">{section.title}</h3>
        )}
        <ActionButtons 
          onDelete={handleDelete}
          isDeletable={isDeletable}
          onFold={toggleExpand}
          isExpanded={isExpanded}
          dragHandleProps={dragHandleProps}
          mode="custom"
        />
      </div>
      <div 
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const projectPlaceholder = `
· 프로젝트명: 프로젝트의 이름을 입력하세요.
· 기간: 프로젝트 수행 기간을 입력하세요. (예: 2023.01 - 2023.06)
· 역할: 프로젝트에서 맡은 역할을 간단히 설명하세요.
· 주요 업무: 프로젝트에서 수행한 주요 업무를 bullet point로 나열하세요.
· 사용 기술: 프로젝트에서 사용한 기술 스택을 나열하세요.
· 결과: 프로젝트의 결과나 성과를 간단히 설명하세요.
`.trim();

const awardPlaceholder = `
· 수상명: 수상한 상의 이름을 입력하세요.
· 수여 기관: 상을 수여한 기관의 이름을 입력하세요.
· 수상 날짜: 수상한 날짜를 입력하세요. (예: 2023.05)
· 수상 내용: 수상 내용이나 의미를 간단히 설명하세요.
`.trim();

const certificationPlaceholder = `
· 자격증명: 취득한 자격증의 이름을 입력하세요.
· 발급 기관: 자격증을 발급한 기관의 이름을 입력하세요.
· 취득일: 자격증을 취득한 날짜를 입력하세요. (예: 2023.03)
· 유효 기간: 자격증의 유효 기간이 있다면 입력하세요. (예: 2023.03 - 2028.03)
`.trim();

const languagePlaceholder = `
· 언어: 구사할 수 있는 언어를 입력하세요.
· 수준: 해당 언어의 구사 수준을 입력하세요. (예: 유창함, 비즈니스 레벨, 일상 회화 가능 등)
· 시험 점수: 공인 언어 시험 점수가 있다면 입력하세요. (예: TOEIC 900점, JLPT N1 등)
· 취득일: 시험 점수를 취득한 날짜를 입력하세요. (예: 2023.06)
`.trim();

const activityPlaceholder = `
· 활동명: 참여한 활동의 이름을 입력하세요.
· 기관/단체: 활동을 주관한 기관이나 단체의 이름을 입력하세요.
· 기간: 활동 기간을 입력하세요. (예: 2023.01 - 2023.12)
· 역할: 활동에서 맡은 역할을 간단히 설명하세요.
· 주요 내용: 활동의 주요 내용을 bullet point로 나열하세요.
· 성과: 활동을 통해 얻은 성과나 배운 점을 간단히 설명하세요.
`.trim();

const defaultPlaceholder = `
· 제목: 항목의 제목을 입력하세요.
· 날짜/기간: 관련된 날짜나 기간을 입력하세요.
· 설명: 항목에 대한 자세한 설명을 입력하세요.
· 주요 내용: 중요한 내용을 bullet point로 나열하세요.
· 결과/성과: 관련된 결과나 성과가 있다면 설명하세요.
`.trim();

export default React.memo(CustomSectionInput);