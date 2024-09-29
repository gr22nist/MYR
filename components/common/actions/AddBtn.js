import React from 'react';
import { AddLineBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const AddButton = ({ onClick, ariaLabel = '추가' }) => (
  <IconButton 
    icon={AddLineBtn} 
    onClick={onClick} 
    hoverFill="fill-secondary-dark"
    size="small"
    aria-label={ariaLabel}
  />
);

export default AddButton;
