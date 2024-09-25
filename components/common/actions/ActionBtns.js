import React from 'react';
import DeleteButton from './DeleteBtn';
import FoldButton from './FoldBtn';
import { DragHandleBtn } from '@/components/icons/IconSet';

const ActionButtons = ({ onDelete, isDeletable, onFold, isExpanded, dragHandleProps, mode = 'item' }) => {
  if (mode === 'item') {
    return (
      <div className="flex items-center space-x-2">
        {isDeletable && <DeleteButton onClick={onDelete} />}
        <div className="cursor-grab active:cursor-grabbing" {...dragHandleProps}>
          <DragHandleBtn className="w-5 h-5" />
        </div>
      </div>
    );
  } else if (mode === 'section') {
    return (
      <div className="flex items-center space-x-2">
        {!isExpanded && (
          <div className="cursor-grab active:cursor-grabbing" {...dragHandleProps}>
            <DragHandleBtn className="w-5 h-5" />
          </div>
        )}
        <FoldButton onClick={onFold} isExpanded={isExpanded} />
      </div>
    );
  } else if (mode === 'custom') {
    return (
      <div className="flex items-center space-x-2">
        {!isExpanded && (
          <div className="cursor-grab active:cursor-grabbing" {...dragHandleProps}>
            <DragHandleBtn className="w-5 h-5" />
          </div>
        )}
        {isDeletable && <DeleteButton onClick={onDelete} />}
        <FoldButton onClick={onFold} isExpanded={isExpanded} />
      </div>
    );
  }

  return null;
};

export default ActionButtons;
