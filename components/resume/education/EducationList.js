import React, { useEffect, useCallback } from 'react';
import EducationItem from './EducationItem';
import AccordionSection from '@/components/common/AccordionSection';
import AddButton from '@/components/common/actions/AddBtn';
import useEducationStore from '@/store/educationStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableEducationItem = ({ education, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: education.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <EducationItem
        education={education}
        {...props}
        dragHandleProps={{ ...listeners }}
      />
    </div>
  );
};

const EducationList = ({ isExpanded, onToggle, section, onSectionChange }) => {
  const { 
    educations, 
    addEducation, 
    updateEducation, 
    deleteEducation, 
    loadEducations, 
    reorderEducations 
  } = useEducationStore();

  useEffect(() => {
    if (educations.status === 'idle') {
      loadEducations();
    }
  }, [educations.status, loadEducations]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEducationChange = useCallback((updatedEducation) => {
    updateEducation(updatedEducation);
  }, [updateEducation]);

  const handleAddEducation = useCallback(() => {
    const newId = `education-${Date.now()}`;
    const newEducation = {
      id: newId,
      schoolName: '',
      major: '',
      startDate: '',
      endDate: '',
      department: '',
      graduationStatus: '졸업',
      order: educations.items.length
    };
    addEducation(newEducation);
  }, [addEducation, educations.items.length]);

  const handleDeleteEducation = useCallback((id) => {
    if (educations.items.length > 1) {
      deleteEducation(id);
    }
  }, [educations.items.length, deleteEducation]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = educations.items.findIndex((education) => education.id === active.id);
      const newIndex = educations.items.findIndex((education) => education.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderEducations(oldIndex, newIndex);
      }
    }
  };

  const addButtonComponent = (
    <AddButton onClick={handleAddEducation} ariaLabel="학력 추가" />
  );

  if (educations.status === 'loading') {
    return <div>학력 정보를 불러오는 중...</div>;
  }

  if (educations.status === 'failed') {
    return <div>학력 정보를 불러오는데 실패했습니다: {educations.error}</div>;
  }

  return (
    <AccordionSection 
      title="학력" 
      addButtonComponent={addButtonComponent}
      isExpanded={isExpanded}
      onToggle={onToggle}
      mode="section"
    >
      {isExpanded && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={educations.items.map(education => education.id)} strategy={verticalListSortingStrategy}>
            {educations.items.map((education) => (
              <SortableEducationItem
                key={education.id}
                education={education}
                onEducationChange={handleEducationChange}
                onDelete={handleDeleteEducation}
                isDeletable={educations.items.length > 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </AccordionSection>
  );
};

export default EducationList;
