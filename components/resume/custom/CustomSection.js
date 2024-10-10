import React, { useCallback, useRef, useEffect, useState } from 'react';
import AccordionSection from '@/components/common/AccordionSection';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useCustomSectionsStore from '@/store/customStore';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import LinkItems from './LinkItems';
import { common } from '@/styles/constLayout';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const CustomSection = ({ section, onSectionChange, onDelete, isExpanded, onToggle, dragHandleProps, className }) => {
  const { updateCustomSection, removeCustomSection } = useCustomSectionsStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef(null);
  const sectionRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    setTimeout(() => {
      removeCustomSection(section.id);
      onDelete(section.id);
    }, 300);
  }, [removeCustomSection, onDelete, section.id]);

  const handleChange = useCallback((field, value) => {
    const updatedSection = { ...section, [field]: value };
    updateCustomSection(section.id, updatedSection);
    onSectionChange(updatedSection);
  }, [updateCustomSection, onSectionChange, section]);

  useEffect(() => {
    if (isDeleting && sectionRef.current) {
      sectionRef.current.style.maxHeight = '0px';
      sectionRef.current.style.opacity = '0';
    }
  }, [isDeleting]);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = '0px';
      }
    }
  }, [isExpanded, section.content]);

  const isCustomType = section.type === CUSTOM_SECTIONS.type;

  const getPlaceholder = () => {
    switch (section.title) {
      case '프로젝트':
        return PLACEHOLDERS.project;
      case '수상':
        return PLACEHOLDERS.award;
      case '자격증':
        return PLACEHOLDERS.certification;
      case '어학':
        return PLACEHOLDERS.language;
      case '활동':
        return PLACEHOLDERS.activity;
      default:
        return PLACEHOLDERS.default;
    }
  };

  const renderTitle = () => {
    if (isCustomType) {
      return (
        <FloatingLabelInput
          label="제목"
          value={section.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="제목을 입력해주세요"
          spellCheck="false"
          maxLength="100"
          isCore={true}
          isTitle={true}
          tooltipMessage="제목을 꼭 입력해 주세요."
        />
      );
    } else {
      return PREDEFINED_SECTIONS[section.type] || section.title || '제목 없음';
    }
  };

  const renderContent = () => {
    if (section.title === '링크') {
      return (
        <LinkItems
          links={section.links || []}
          onChange={(newLinks) => handleChange('links', newLinks)}
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
          className={`overflow-hidden resize-none px-4 ${common.placeholderStyle}`}
        />
      );
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div ref={sectionRef} className={`bg-white rounded-lg shadow-md ${isDeleting ? 'deleting' : ''}`}>
        <AccordionSection
          title={renderTitle()}
          isExpanded={isExpanded}
          onToggle={onToggle}
          dragHandleProps={{ ...attributes, ...listeners, ...dragHandleProps }}
          mode="custom"
          onDelete={handleDelete}
          isCustomTitle={isCustomType}
        >
          <div 
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ease-in-out section-content ${isExpanded ? 'expanded' : ''}`}
          >
            <div className="p-4">
              {renderContent()}
            </div>
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};