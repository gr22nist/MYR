import React from 'react';
import { FoldBtn as FoldIcon } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const FoldButton = ({ onClick, isExpanded, ariaLabel = '접기/펼치기' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full hover:bg-gray-100 transition-colors duration-200"
      aria-label={ariaLabel}
    >
      <IconButton 
        icon={FoldIcon} 
        hoverFill="fill-secondary-dark"
        size="small"
        aria-hidden="true"
        className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
  );
};

export default FoldButton;
