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
      aria-label={ariaLabel}
    >
      <IconButton 
        icon={isSubItem ? DeleteBtn : DeleteLineBtn}
        size='small'
        aria-hidden='true'
        className={'btn-rotate'}
      />
    </button>
  );
};

export default DeleteButton;
