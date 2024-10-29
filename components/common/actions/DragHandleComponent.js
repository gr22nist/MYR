import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleBtn, DragHandleLineBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const DragHandleComponent = ({ id, isSubItem, dragHandleProps }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleProps = dragHandleProps || { ...listeners, ...attributes };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...handleProps} 
      className='drag-item'
    >
      <IconButton 
        icon={isSubItem ? DragHandleBtn : DragHandleLineBtn}
        size='small'
        aria-hidden='true'
      />
    </div>
  );
};

export default DragHandleComponent;
