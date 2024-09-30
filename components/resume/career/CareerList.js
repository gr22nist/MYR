import React, { useEffect, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddBtn from '@/components/common/actions/AddBtn';
import useCareerStore from '@/store/careerStore';
import SortableCareerItem from './SortableCareerItem';
import { useSortableList } from '@/hooks/useSortableList';
import useGlobalStore from '@/store/globalStore';
import AnimatedList from '@/components/common/AnimatedList';

const CareerList = ({ isExpanded, onToggle, section, onSectionChange }) => {
  const { 
    careers, 
    addCareer, 
    updateCareer, 
    deleteCareer, 
    loadCareers, 
    reorderCareers
  } = useCareerStore();

  const { showToast } = useGlobalStore();
  const { sensors, handleDragEnd, modifiers } = useSortableList(careers, reorderCareers, true);

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

  const isDraggable = careers.length > 1;

  const renderCareerItem = useCallback((career) => (
    <SortableCareerItem
      key={career.id}
      career={career}
      onCareerChange={handleCareerChange}
      onDelete={handleDeleteCareer}
      isDeletable={careers.length > 1}
      isExpanded={isExpanded}
      isDraggable={isDraggable}
    />
  ), [handleCareerChange, handleDeleteCareer, careers.length, isExpanded, isDraggable]);

  if (careers.status === 'loading') {
    return <div>경력 정보를 불러오는 중...</div>;
  }
  if (careers.status === 'error') {
    showToast({ message: '경력 정보 로딩 실패.', type: 'error' });
    return null;
  }

  return (
    <>
      <AddBtn 
        onClick={handleAddCareer}  // 여기서 handleAddCareer 함수를 전달합니다.
        label="새로운 경력을 추가해보세요" 
        ariaLabel="새 경력 항목 추가"
      />
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        modifiers={modifiers}
      >
        <SortableContext items={careers.map(career => career.id)} strategy={verticalListSortingStrategy}>
          <AnimatedList
            items={careers}
            renderItem={renderCareerItem}
            keyExtractor={(career) => career.id}
          />
        </SortableContext>
      </DndContext>
      {careers.length === 0 && (
        null
      )}
    </>
  );
};

export default CareerList;