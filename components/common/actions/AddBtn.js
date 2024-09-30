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
      className="w-full py-2 px-4 mb-2 text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-between"
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
