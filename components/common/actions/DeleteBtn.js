import React from 'react';
import { DeleteBtn } from '@/components/icons/IconSet';

const DeleteButton = ({ onClick }) => (
  <button 
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }} 
    className="p-1 rounded-full"
  >
    <DeleteBtn className="fill-mono-99 hover:fill-red-500 hover:scale-110 duration-300" />
  </button>
);

export default DeleteButton;
