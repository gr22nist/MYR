import React, { useMemo, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import CareerList from '../../resume/career/CareerList';
import EducationList from '../../resume/education/EducationList';
import CustomSection from '../../resume/custom/CustomSection';
import { CUSTOM_SECTIONS } from '@/constants/resumeConstants';
import SortableItem from './SortableItem';
import AccordionSection from '@/components/common/AccordionSection';

const SortableSectionList = ({ sections, onSectionChange, onDelete, onReorder, expandedSections, onToggleExpand }) => {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  const sectionComponents = useMemo(() => ({
    career: CareerList,
    education: EducationList,
    [CUSTOM_SECTIONS.type]: CustomSection,
    project: CustomSection,
    award: CustomSection,
    certificate: CustomSection,
    language: CustomSection,
    skill: CustomSection,
    link: CustomSection,
  }), []);

  const renderSection = (section) => {
    const SectionComponent = sectionComponents[section.type];
    if (!SectionComponent) return null;
  
    const isExpanded = expandedSections[section.id];
    const isCustom = section.type === CUSTOM_SECTIONS.type || ['project', 'award', 'certificate', 'language', 'skill', 'link'].includes(section.type);
  
    if (isCustom) {
      return (
        <SectionComponent
          key={section.id}
          section={section}
          onSectionChange={(updatedSection) => onSectionChange(updatedSection)}
          isExpanded={isExpanded}
          onToggle={() => onToggleExpand(section.id)}
          onDelete={() => onDelete(section.id)}
        />
      );
    }
  
    return (
      <AccordionSection
        key={section.id}
        title={section.title}
        isExpanded={isExpanded}
        onToggle={() => onToggleExpand(section.id)}
        onDelete={() => onDelete(section.id)}
        mode='section'
        dragHandleProps={!isExpanded ? { 'data-drag-handle': true } : {}}
      >
        <SectionComponent
          section={section}
          onSectionChange={(updatedSection) => onSectionChange(updatedSection)}
          isExpanded={isExpanded}
        />
      </AccordionSection>
    );
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => {
          const renderedSection = renderSection(section);
          if (!renderedSection) return null; // null인 경우 렌더링하지 않음
          return (
            <SortableItem key={section.id} id={section.id}>
              {renderedSection}
            </SortableItem>
          );
        })}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className='dragging-section-header'>
            {sections.find(section => section.id === activeId)?.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableSectionList;