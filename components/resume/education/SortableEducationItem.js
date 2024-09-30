import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EducationItem from './EducationItem';

const SortableEducationItem = ({ education, onEducationChange, onDelete, isDeletable, isExpanded, isDraggable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: education.id, disabled: !isDraggable });

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
        dragHandleProps={isDraggable ? { ...attributes, ...listeners } : null}
        isSubItem={true}
        isExpanded={isExpanded}
        isDraggable={isDraggable}
      />
    </div>
  );
};

export default SortableEducationItem;
