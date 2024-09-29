import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleBtn, DragHandleLineBtn } from '@/components/icons/IconSet'

const DragHandleComponent = ({ id, isSubItem, dragHandleProps }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleProps = dragHandleProps || { ...listeners, ...attributes };

  return (
    <div ref={setNodeRef} style={style} {...handleProps} className="cursor-grab active:cursor-grabbing">
      {isSubItem ? <DragHandleBtn /> : <DragHandleLineBtn />}
    </div>
  );
};

export default DragHandleComponent;
