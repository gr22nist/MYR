import React from 'react';
import { AddBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const AddButton = ({ onClick, ariaLabel = '추가' }) => (
  <IconButton 
    icon={AddBtn} 
    onClick={onClick} 
    hoverFill="fill-secondary-dark"
    size="small"
    aria-label={ariaLabel}
  />
);

export default AddButton;
