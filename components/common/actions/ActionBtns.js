import React from 'react';
import DragHandle from './DragHandle';
import DeleteButton from './DeleteBtn';

const ActionButtons = ({ onDelete, isDeletable, dragHandleProps }) => {
  return (
    <div className="absolute top-2 right-2 flex items-center space-x-2">
      <DragHandle dragHandleProps={dragHandleProps} />
      {isDeletable && <DeleteButton onClick={onDelete} />}
    </div>
  );
};

export default ActionButtons;
