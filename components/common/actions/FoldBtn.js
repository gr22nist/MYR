import React from 'react';
import { FoldBtn as FoldIcon } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const FoldButton = ({ onClick, isExpanded }) => (
  <IconButton 
    icon={FoldIcon} 
    onClick={onClick} 
    hoverFill="fill-secondary-dark"
    className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
  />
);

export default FoldButton;
