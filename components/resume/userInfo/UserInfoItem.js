import React from 'react';
import PropTypes from 'prop-types';
import { EditBtn, DeleteBtn } from '@/components/icons/IconSet';

const UserInfoItem = ({ type, displayType, value, onRemove, onEdit, dragHandleProps }) => {
  const displayValue = typeof value === 'string' ? value : 
                       (typeof value === 'object' && value !== null ? value.value : '');

  const { ...dragProps } = dragHandleProps;

  return (
    <div className="personal-info-item p-4 relative rounded-lg bg-mono-f5 hover:shadow-md transition-shadow duration-300">
      <div {...dragProps} className="cursor-grab active:cursor-grabbing">
        <div className="text-sm font-bold mb-2 text-mono-99">{displayType}</div>
        <div className="text-mono-11 font-bold">{displayValue}</div>
      </div>
      <div className="absolute top-2 right-2 flex space-x-2">
        <button onClick={onEdit} className="text-mono-dd hover:text-mono-66 duration-300">
          <EditBtn />
        </button>
        <button onClick={onRemove} className="text-mono-dd hover:text-red-700 duration-300">
          <DeleteBtn />
        </button>
      </div>
    </div>
  );
};

UserInfoItem.propTypes = {
  type: PropTypes.string.isRequired,
  displayType: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string
    })
  ]).isRequired,
  onRemove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  dragHandleProps: PropTypes.object,
};

export default UserInfoItem;