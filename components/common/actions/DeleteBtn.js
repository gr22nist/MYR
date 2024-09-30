import React from 'react';
import { DeleteBtn, DeleteLineBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const DeleteButton = ({ onClick, isSubItem, ariaLabel = '삭제' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full hover:bg-gray-200 transition-colors duration-200"
      aria-label={ariaLabel}
    >
      <IconButton 
        icon={isSubItem ? DeleteBtn : DeleteLineBtn}
        size="small"
        aria-hidden="true"
      />
    </button>
  );
};

export default DeleteButton;
