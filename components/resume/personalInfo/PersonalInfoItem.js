import React from 'react';

const PersonalInfoItem = ({ type, value, onRemove, onEdit }) => {
  const getDisplayValue = () => {
    if (type === 'custom') {
      return value.value;
    }
    return value;
  };

  const getDisplayType = () => {
    if (type === 'custom') {
      return value.title;
    }
    return type;
  };

  return (
    <div className="personal-info-item border p-4 relative">
      <div className="font-bold mb-2">{getDisplayType()}</div>
      <div className="text-gray-700">{getDisplayValue()}</div>
      <div className="absolute top-2 right-2 flex space-x-2">
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
          *
        </button>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">
          x
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoItem;