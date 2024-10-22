import React from 'react';
import PropTypes from 'prop-types';
import { EditBtn, DeleteBtn } from '@/components/icons/IconSet';

const UserInfoItem = ({ type, displayType, value, onRemove, onEdit, dragHandleProps }) => {
  const displayValue = type === 'custom' ? value.value : value;
  const finalDisplayType = type === 'custom' ? value.title : displayType;

  return (
    <div className="drag-item userinfo-container">
      <div {...dragHandleProps} className="userinfo-item">
        <div className="userinfo-item-type">{finalDisplayType}</div>
        <div className="font-bold">{displayValue}</div>
      </div>
      <div className="userinfo-item-btns">
        <button onClick={onEdit} className="userinfo-item-btn">
          <EditBtn />
        </button>
        <button onClick={onRemove} className="userinfo-item-btn">
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