import React from 'react';
import { DragHandleBtn } from '@/components/icons/IconSet';
import IconButton from '../IconButton';

const DragHandle = ({ dragHandleProps }) => (
  <IconButton 
    icon={DragHandleBtn} 
    {...dragHandleProps} 
    className="cursor-grab"
  />
);

export default DragHandle;
