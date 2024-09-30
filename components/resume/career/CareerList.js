import React, { useEffect, useCallback } from 'react';
import AddButton from '@/components/common/actions/AddBtn';
import useCareerStore from '@/store/careerStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCareerItem from './SortableCareerItem';
import { useSortableList } from '@/hooks/useSortableList';

const CareerList = ({ isExpanded, onToggle, section, onSectionChange }) => {
  const { 
    careers, 
    addCareer, 
    updateCareer, 
    deleteCareer, 
    loadCareers, 
    reorderCareers
  } = useCareerStore();

  const { sensors, handleDragEnd } = useSortableList(careers, reorderCareers);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  const handleCareerChange = useCallback((updatedCareer) => {
    updateCareer(updatedCareer);
  }, [updateCareer]);

  const handleDeleteCareer = useCallback((careerId) => {
    deleteCareer(careerId);
  }, [deleteCareer]);

  const handleAddCareer = useCallback(() => {
    addCareer();
  }, [addCareer]);

  if (careers.status === 'loading') {
    return <div>경력 정보를 불러오는 중...</div>;
  }

  if (careers.status === 'failed') {
    return <div>경력 정보를 불러오는데 실패했습니다: {careers.error}</div>;
  }

  return (
    <>
      <AddButton onClick={handleAddCareer} ariaLabel="경력 추가" />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={careers.map(career => career.id)} strategy={verticalListSortingStrategy}>
          {careers.map((career) => (
            <SortableCareerItem
              key={career.id}
              career={career}
              onCareerChange={handleCareerChange}
              onDelete={handleDeleteCareer}
              isDeletable={careers.length > 1}
              isExpanded={isExpanded}
            />
          ))}
        </SortableContext>
      </DndContext>
      {careers.length === 0 && (
        <p>경력 정보가 없습니다. 새로운 경력을 추가해 주세요.</p>
      )}
    </>
  );
};

export default CareerList;