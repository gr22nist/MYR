import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSTransition } from 'react-transition-group';
import EducationItem from './EducationItem';

const SortableEducationItem = ({ education, onEducationChange, onDelete, isDeletable, isExpanded, isDraggable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ 
    id: education.id, 
    disabled: !isDraggable,
  });

  const nodeRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1000 : 1,
    willChange: 'transform',
    transition: isDragging ? 'none' : 'transform 150ms ease',
  };

  const maskStyle = isDragging ? {
    WebkitMask: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)',
    mask: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  } : {};

  return (
    <CSSTransition nodeRef={nodeRef} timeout={150} classNames="item">
      <div 
        ref={(node) => {
          setNodeRef(node);
          nodeRef.current = node;
        }} 
        style={{...style, ...maskStyle}}
        className={`${isDragging ? 'touch-none' : ''} transition-all duration-150`}
      >
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
    </CSSTransition>
  );
};

export default SortableEducationItem;
