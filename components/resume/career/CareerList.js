import React, { useCallback, useState, useEffect } from 'react';
import CareerItem from './CareerItem';
import AccordionSection from '@/components/common/AccordionSection';
import AddButton from '@/components/common/actions/AddBtn';
import useCareerStore from '@/store/careerStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';

const SortableCareerItem = ({ career, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: career.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CareerItem
        career={career}
        dragHandleProps={{ ...attributes, ...listeners }}
        {...props}
      />
    </div>
  );
};

const CareerList = ({ isExpanded, onToggle, section, onSectionChange }) => {
  const { careers, addCareer, updateCareer, deleteCareer, loadCareers, reorderCareers } = useCareerStore();
  const [isExpandedState, setIsExpandedState] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (careers.status === 'idle') {
      loadCareers();
    }
  }, [careers.status, loadCareers]);

  const handleCareerChange = useCallback((updatedCareer) => {
    updateCareer(updatedCareer);
  }, [updateCareer]);

  const handleAddCareer = useCallback(() => {
    const newCareer = {
      id: `career-${Date.now()}`,
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      tasks: ''
    };
    addCareer(newCareer);
  }, [addCareer]);

  const handleDeleteCareer = useCallback((id) => {
    if (careers.items.length > 1) {
      deleteCareer(id);
    }
  }, [careers.items.length, deleteCareer]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = careers.items.findIndex((career) => career.id === active.id);
      const newIndex = careers.items.findIndex((career) => career.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCareers(oldIndex, newIndex);
      }
    }
  };

  const addButtonComponent = (
    <AddButton onClick={handleAddCareer} ariaLabel="경력 추가" />
  );

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: 'career-list' });

  const sectionStyle = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const toggleExpand = useCallback((newIsExpanded) => {
    setIsExpandedState(newIsExpanded);
  }, []);

  return (
    <div ref={setNodeRef} style={sectionStyle}>
      <AccordionSection 
        title="경력" 
        addButtonComponent={addButtonComponent}
        isExpanded={isExpanded}
        onToggle={onToggle}
        mode="section"
      >
        {isExpanded && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={careers.items.map(career => career.id)} strategy={verticalListSortingStrategy}>
              {careers.items.map((career) => (
                <SortableCareerItem
                  key={career.id}
                  career={career}
                  onCareerChange={handleCareerChange}
                  onDelete={handleDeleteCareer}
                  isDeletable={careers.items.length > 1}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </AccordionSection>
    </div>
  );
};

export default CareerList;