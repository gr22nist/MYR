import React from 'react';
import { AddLineBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const AddBtn = ({ onClick, label, ariaLabel = '추가' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full p-4 text-mono-66 hover:bg-mono-f5 rounded-md transition-colors duration-300 flex items-center justify-between"
      aria-label={ariaLabel}
    >
      <div className="flex items-center">
        <IconButton 
          icon={AddLineBtn} 
          hoverFill="fill-secondary-dark"
          size="small"
          aria-hidden="true"
        />
        <span className="ml-2">{label}</span>
      </div>
    </button>
  );
};

export default AddBtn;
