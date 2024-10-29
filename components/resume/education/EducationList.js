import React, { useEffect, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddBtn from '@/components/common/actions/AddBtn';
import useEducationStore from '@/store/educationStore';
import SortableEducationItem from './SortableEducationItem';
import { useSortableList } from '@/hooks/useSortableList';
import useGlobalStore from '@/store/globalStore';
import AnimatedList from '@/components/common/AnimatedList';

const EducationList = ({ isExpanded, onToggle, section, onSectionChange }) => {
  const { 
    educations, 
    addEducation, 
    updateEducation, 
    deleteEducation, 
    loadEducations, 
    reorderEducations
  } = useEducationStore();

  const { showToast } = useGlobalStore();
  const { sensors, handleDragEnd, modifiers } = useSortableList(educations, reorderEducations, true);

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

  const isDraggable = educations.length > 1;

  const renderEducationItem = useCallback((education) => (
    <SortableEducationItem
      key={education.id}
      education={education}
      onEducationChange={handleEducationChange}
      onDelete={handleDeleteEducation}
      isDeletable={educations.length > 1}
      isExpanded={isExpanded}
      isDraggable={isDraggable}
    />
  ), [handleEducationChange, handleDeleteEducation, educations.length, isExpanded, isDraggable]);

  if (educations.status === 'loading') {
    return <div>학력 정보를 불러오는 중...</div>;
  }

  if (educations.status === 'error') {
    showToast({ message: '학력 정보 로딩 실패.', type: 'error' });
    return null;
  }

  return (
    <>
      <AddBtn
        onClick={handleAddEducation}
        label='새로운 학력을 추가해보세요'
        ariaLabel='새 학력 항목 추가'
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={modifiers}
      >
        <SortableContext items={educations.map(education => education.id)} strategy={verticalListSortingStrategy}>
          <AnimatedList
            items={educations}
            renderItem={renderEducationItem}
            keyExtractor={(education) => education.id}
          />
        </SortableContext>
      </DndContext>
      {educations.length === 0 && (
        null
      )}
    </>
  );
};

export default EducationList;
