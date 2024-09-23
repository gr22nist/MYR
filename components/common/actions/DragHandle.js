import React from 'react';
import { DragHandler } from '@/components/icons/IconSet';

const DragHandle = ({ dragHandleProps }) => (
  <div {...dragHandleProps} className="cursor-grab p-1 rounded-full">
    <DragHandler className="fill-mono-99 hover:fill-secondary-dark hover:scale-110 duration-300" />
  </div>
);

export default DragHandle;
