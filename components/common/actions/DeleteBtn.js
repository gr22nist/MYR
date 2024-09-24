import React from 'react';
import { DeleteBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const DeleteButton = ({ onClick }) => (
  <IconButton 
    icon={DeleteBtn} 
    onClick={onClick} 
    hoverFill="fill-red-500"
  />
);

export default DeleteButton;
