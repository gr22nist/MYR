import React from 'react';
import { DeleteBtn, DeleteLineBtn } from '@/components/icons/IconSet';

const DeleteButton = ({ onClick, isSubItem }) => {
  const handleClick = (e) => {
    console.log('DeleteButton clicked');
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full hover:bg-gray-200 transition-colors duration-200"
    >
      {isSubItem ? <DeleteBtn /> : <DeleteLineBtn />}
    </button>
  );
};

export default DeleteButton;
