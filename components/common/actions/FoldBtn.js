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
      aria-label={ariaLabel}
    >
      <IconButton 
        icon={FoldIcon}
        hoverFill='fill-secondary-dark'
        size='small'
        aria-hidden='true'
        className={`btn-rotate ${isExpanded ? 'rotate-180 hover:rotate-0' : ''}`}
      />
    </button>
  );
};

export default FoldButton;
