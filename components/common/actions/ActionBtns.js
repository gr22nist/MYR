import React from 'react';
import DeleteButton from './DeleteBtn';
import FoldButton from './FoldBtn';
import DragHandleComponent from './DragHandleComponent';

const ActionButtons = ({ onDelete, isDeletable, onFold, isExpanded, id, mode = 'item', isSubItem = false, dragHandleProps }) => {

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete();
    } else {
      console.error('onDelete is not a function in ActionButtons:', onDelete);
    }
  };

  const renderButtons = () => {
    switch (mode) {
      case 'item':
        return (
          <>
            {isDeletable && <DeleteButton onClick={handleDelete} isSubItem={isSubItem} />}
            <DragHandleComponent id={id} isSubItem={isSubItem} dragHandleProps={dragHandleProps} />
          </>
        );
      case 'section':
        return (
          <>
            {!isExpanded && <DragHandleComponent id={id} isSubItem={false} dragHandleProps={dragHandleProps} />}
            <FoldButton onClick={onFold} isExpanded={isExpanded} />
          </>
        );
      case 'custom':
        return (
          <>
            <DeleteButton onClick={handleDelete} isSubItem={false} />
            {!isExpanded && <DragHandleComponent id={id} isSubItem={false} dragHandleProps={dragHandleProps} />}
            <FoldButton onClick={onFold} isExpanded={isExpanded} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      {renderButtons()}
    </div>
  );
};

export default ActionButtons;
