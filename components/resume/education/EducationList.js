import React, { useEffect, useCallback } from 'react';
import AddButton from '@/components/common/actions/AddBtn';
import useEducationStore from '@/store/educationStore';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableEducationItem from './SortableEducationItem';
import { useSortableList } from '@/hooks/useSortableList';

const EducationList = ({ isExpanded, onToggle, section, onSectionChange }) => {
  const { 
    educations, 
    addEducation, 
    updateEducation, 
    deleteEducation, 
    loadEducations, 
    reorderEducations
  } = useEducationStore();

  const { sensors, handleDragEnd } = useSortableList(educations, reorderEducations);

  useEffect(() => {
    loadEducations();
  }, [loadEducations]);

  const handleEducationChange = useCallback((updatedEducation) => {
    updateEducation(updatedEducation);
  }, [updateEducation]);

  const handleDeleteEducation = useCallback((educationId) => {
    deleteEducation(educationId);
  }, [deleteEducation]);

  const handleAddEducation = useCallback(() => {
    addEducation();
  }, [addEducation]);

  if (educations.status === 'loading') {
    return <div>학력 정보를 불러오는 중...</div>;
  }

  if (educations.status === 'error') {
    return <div>학력 정보를 불러오는데 실패했습니다: {educations.error}</div>;
  }

  return (
    <>
      <AddButton onClick={handleAddEducation} ariaLabel="학력 추가" />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={educations.map(education => education.id)} strategy={verticalListSortingStrategy}>
          {educations.map((education) => (
            <SortableEducationItem
              key={education.id}
              education={education}
              onEducationChange={handleEducationChange}
              onDelete={handleDeleteEducation}
              isDeletable={educations.length > 1}
              isExpanded={isExpanded}
            />
          ))}
        </SortableContext>
      </DndContext>
      {educations.length === 0 && (
        <p>학력 정보가 없습니다. 새로운 학력을 추가해 주세요.</p>
      )}
    </>
  );
};

export default EducationList;
