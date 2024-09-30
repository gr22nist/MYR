import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DeleteButton from './DeleteBtn';
import FoldButton from './FoldBtn';

const DragHandleComponent = dynamic(() => import('./DragHandleComponent'), { ssr: false });

const ActionButtons = ({ onDelete, isDeletable, onFold, isExpanded, id, mode = 'item', isSubItem = false, dragHandleProps }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            {isClient && <DragHandleComponent id={id} isSubItem={isSubItem} dragHandleProps={dragHandleProps} />}
          </>
        );
      case 'section':
        return (
          <>
            {!isExpanded && isClient && <DragHandleComponent id={id} isSubItem={false} dragHandleProps={dragHandleProps} />}
            <FoldButton onClick={onFold} isExpanded={isExpanded} />
          </>
        );
      case 'custom':
        return (
          <>
            <DeleteButton onClick={handleDelete} isSubItem={false} />
            {!isExpanded && isClient && <DragHandleComponent id={id} isSubItem={false} dragHandleProps={dragHandleProps} />}
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
