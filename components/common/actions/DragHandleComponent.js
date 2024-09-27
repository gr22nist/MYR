import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleBtn, DeleteLineBtn } from '@/components/icons/IconSet'

const DragHandleComponent = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {/* 드래그 핸들 내용 */}
      <DragHandleBtn />
    </div>
  );
};

export default DragHandleComponent;
