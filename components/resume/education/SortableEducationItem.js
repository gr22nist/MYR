import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EducationItem from './EducationItem';

const SortableEducationItem = ({ education, onEducationChange, onDelete, isDeletable, isExpanded }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: education.id });  // stableId 대신 id 사용

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
        isSubItem={true}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default SortableEducationItem;
