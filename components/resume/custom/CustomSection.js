import React, { useCallback } from 'react';
import AccordionSection from '@/components/common/AccordionSection';
import CustomSectionItem from './CustomItem';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useCustomSections from '@/hooks/useCustomSections';  // 파일명 변경
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';

const CustomSection = ({ section, onSectionChange, onDelete, isExpanded, onToggle }) => {
  const { updateCustomSection, removeCustomSection } = useCustomSections();

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
    removeCustomSection(section.id);
    onDelete(section.id);
  }, [removeCustomSection, onDelete, section.id]);

  const handleChange = useCallback((updatedSection) => {
    updateCustomSection(section.id, updatedSection);  // updateCustomSection 사용
    onSectionChange(updatedSection);
  }, [updateCustomSection, onSectionChange, section.id]);

  const isCustomType = section.type === CUSTOM_SECTIONS.type;

  const renderTitle = () => {
    if (isCustomType) {
      return (
        <FloatingLabelInput
          label="제목"
          value={section.title || ''}
          onChange={(e) => handleChange({ ...section, title: e.target.value })}
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

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionSection
        title={renderTitle()}
        isExpanded={isExpanded}
        onToggle={onToggle}
        dragHandleProps={{ ...attributes, ...listeners }}
        mode="custom"
        onDelete={handleDelete}
      >
        <CustomSectionItem
          section={section}
          onChange={handleChange}
          isCustomType={isCustomType}
        />
      </AccordionSection>
    </div>
  );
};

export default React.memo(CustomSection);