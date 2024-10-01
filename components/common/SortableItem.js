import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';

const SortableItem = ({ id, children, isDragging, sectionType, isRemoving, dragHandleRender }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isRemoving ? 0 : isDragging ? 0.5 : 1, // 드래그 중일 때 투명도를 0.5로 설정
    scale: isRemoving ? 0.95 : isDragging ? 1.05 : 1, // 드래그 중일 때 약간 확대
  };

  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <div ref={setNodeRef} style={style} className="transition-all duration-300">
      {typeof children === 'function' ? children(dragHandleProps) : children}
    </div>
  );
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  isDragging: PropTypes.bool,
  sectionType: PropTypes.string,
  isRemoving: PropTypes.bool,
  dragHandleRender: PropTypes.func,
};

// defaultProps 제거

export default SortableItem;
