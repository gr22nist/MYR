import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CareerItem from './CareerItem';

const SortableCareerItem = ({ career, onCareerChange, onDelete, isDeletable, isExpanded, isDraggable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: career.id, disabled: !isDraggable });

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
        dragHandleProps={isDraggable ? { ...attributes, ...listeners } : null}
        isSubItem={true}
        isExpanded={isExpanded}
        isDraggable={isDraggable}
      />
    </div>
  );
};

export default SortableCareerItem;
