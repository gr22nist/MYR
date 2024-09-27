import React, { useEffect, useCallback, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CareerItem from './CareerItem';
import AccordionSection from '@/components/common/AccordionSection';
import AddButton from '@/components/common/actions/AddBtn';
import useCareerStore from '@/store/careerStore';

const SortableCareerItem = ({ career, onCareerChange, onDelete, isDeletable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: career.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CareerItem
        career={career}
        onCareerChange={onCareerChange}
        onDelete={onDelete}
        isDeletable={isDeletable}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const CareerList = () => {
  const { careers, addCareer, updateCareer, deleteCareer, loadCareers, saveCareers, reorderCareers } = useCareerStore();

  useEffect(() => {
    if (careers.status === 'idle') {
      loadCareers();
    }
  }, [careers.status, loadCareers]);

  const handleCareerChange = useCallback((updatedCareer) => {
    updateCareer(updatedCareer);
  }, [updateCareer]);

  const handleAddCareer = useCallback(() => {
    if (careers.items.length > 0) {
      const newId = `career-${Date.now()}`;
      const newCareer = { 
        id: newId, 
        companyName: '', 
        position: '', 
        startDate: '', 
        endDate: '', 
        isCurrent: false, 
        tasks: '' 
      };
      addCareer(newCareer);
    }
  }, [careers.items, addCareer]);

  const handleDeleteCareer = useCallback((id) => {
    if (careers.items.length > 1) {
      deleteCareer(id);
    }
  }, [careers.items, deleteCareer]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = careers.items.findIndex((career) => career.id === active.id);
      const newIndex = careers.items.findIndex((career) => career.id === over.id);
      reorderCareers(oldIndex, newIndex);
    }
  };

  const addButtonComponent = (
    <AddButton onClick={handleAddCareer} ariaLabel="경력 추가" />
  );

  // careers.items가 배열인지 확인
  const careerItems = Array.isArray(careers.items) ? careers.items : [];

  return (
    <AccordionSection title="경력" addButtonComponent={addButtonComponent}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={careerItems.map(career => career.id)}
          strategy={verticalListSortingStrategy}
        >
          {careerItems.map((career) => (
            <SortableCareerItem
              key={career.id}
              career={career}
              onCareerChange={handleCareerChange}
              onDelete={handleDeleteCareer}
              isDeletable={careerItems.length > 1}
            />
          ))}
        </SortableContext>
      </DndContext>
    </AccordionSection>
  );
};

export default CareerList;