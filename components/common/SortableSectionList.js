import React, { useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CareerList from '../resume/career/CareerList';
import EducationList from '../resume/education/EducationList';
import CustomSection from '../resume/custom/CustomSection';
import { CUSTOM_SECTIONS } from '@/constants/resumeConstants';
import SortableItem from './SortableItem';

const SortableSectionList = ({ sections, onSectionChange, onDelete, onReorder, expandedSections, onToggleExpand }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
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

    const commonProps = {
      isExpanded: expandedSections[section.id],
      onToggle: () => onToggleExpand(section.id),
      section: section,
      onSectionChange: (updatedSection) => onSectionChange(updatedSection),
      onDelete: () => onDelete(section.id),
    };

    return (
      <SectionComponent {...commonProps} />
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableItem key={section.id} id={section.id}>
            {renderSection(section)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableSectionList;
