import React from 'react';
import { EditBtn, DeleteBtn } from '@/components/icons/IconSet';

const UserInfoItem = ({ type, displayType, value, onRemove, onEdit }) => {
  return (
    <div className="personal-info-item p-4 relative rounded-lg bg-mono-f5">
      <div className="text-sm font-bold mb-2">{displayType}</div>
      <div className="text-mono-11 font-bold">{value}</div>
      <div className="absolute top-2 right-2 flex space-x-2">
        <button onClick={onEdit} className="text-mono-dd hover:text-blue-700 duration-300">
          <EditBtn />
        </button>
        <button onClick={onRemove} className="text-mono-dd hover:text-red-700 duration-300">
          <DeleteBtn />
        </button>
      </div>
    </div>
  );
};

export default UserInfoItem;