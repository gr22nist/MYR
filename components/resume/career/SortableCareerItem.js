import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSTransition } from 'react-transition-group';
import CareerItem from './CareerItem';

const SortableCareerItem = ({ career, onCareerChange, onDelete, isDeletable, isExpanded, isDraggable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: career.id, disabled: !isDraggable });

  const nodeRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CSSTransition nodeRef={nodeRef} timeout={300} classNames="item">
      <div ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }} style={style}>
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
    </CSSTransition>
  );
};

export default SortableCareerItem;
