import React, { useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EducationItem from './EducationItem';
import AccordionSection from '@/components/common/AccordionSection';
import AddButton from '@/components/common/actions/AddBtn';
import useEducationStore from '@/store/educationStore';

const SortableEducationItem = ({ education, onEducationChange, onDelete, isDeletable }) => {
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
    <div ref={setNodeRef} style={style}>
      <EducationItem
        education={education}
        onEducationChange={onEducationChange}
        onDelete={onDelete}
        isDeletable={isDeletable}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const EducationList = () => {
  const { 
    educations, 
    addEducation, 
    updateEducation, 
    deleteEducation, 
    loadEducations, 
    saveEducations,
    reorderEducations 
  } = useEducationStore();

  useEffect(() => {
    loadEducations();
  }, [loadEducations]);

  const handleEducationChange = useCallback((updatedEducation) => {
    updateEducation(updatedEducation);
    saveEducations(); // 변경 사항 저장
  }, [updateEducation, saveEducations]);

  const handleAddEducation = useCallback(() => {
    const newId = `education-${Date.now()}`;
    const newEducation = {
      id: newId,
      schoolName: '',
      major: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      graduationStatus: '졸업'
    };
    addEducation(newEducation);
    saveEducations(); // 추가 후 저장
  }, [addEducation, saveEducations]);

  const handleDeleteEducation = useCallback((id) => {
    if (educations.items.length > 1) {
      deleteEducation(id);
      saveEducations(); // 삭제 후 저장
    }
  }, [deleteEducation, educations.items, saveEducations]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = educations.items.findIndex((education) => education.id === active.id);
      const newIndex = educations.items.findIndex((education) => education.id === over.id);
      reorderEducations(oldIndex, newIndex);
      saveEducations(); // 순서 변경 후 저장
    }
  };

  const addButtonComponent = (
    <AddButton onClick={handleAddEducation} ariaLabel="학력 추가" />
  );

  // 서버 사이드 렌더링 중 오류 방지
  if (typeof window === 'undefined' || !educations.items) {
    return null;
  }

  return (
    <AccordionSection title="학력" addButtonComponent={addButtonComponent}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={educations.items.map(education => education.id)}
          strategy={verticalListSortingStrategy}
        >
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
    </AccordionSection>
  );
};

export default EducationList;
