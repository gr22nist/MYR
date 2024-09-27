import React from 'react';
import DeleteButton from './DeleteBtn';
import FoldButton from './FoldBtn';
import DragHandle from './DragHandle';

const ActionButtons = ({ onDelete, isDeletable, onFold, isExpanded, dragHandleProps, mode = 'item' }) => {
  if (mode === 'item') {
    return (
      <div className="flex items-center space-x-2">
        <DragHandle dragHandleProps={dragHandleProps} />
        {isDeletable && <DeleteButton onClick={onDelete} />}
      </div>
    );
  } else if (mode === 'section') {
    return (
      <div className="flex items-center space-x-2">
        {!isExpanded && <DragHandle dragHandleProps={dragHandleProps} />}
        <FoldButton onClick={onFold} isExpanded={isExpanded} />
      </div>
    );
  } else if (mode === 'custom') {
    return (
      <div className="flex items-center space-x-2">
        {!isExpanded && <DragHandle dragHandleProps={dragHandleProps} />}
        {isDeletable && <DeleteButton onClick={onDelete} />}
        <FoldButton onClick={onFold} isExpanded={isExpanded} />
      </div>
    );
  }

  return null;
};

export default ActionButtons;
