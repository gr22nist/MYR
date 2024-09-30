import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CareerItem from './CareerItem';

const SortableCareerItem = ({ career, onCareerChange, onDelete, isDeletable, isExpanded }) => {
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
        isSubItem={true}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default SortableCareerItem;
