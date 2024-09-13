import React, { useState } from 'react';

const Item = ({ index, onChange, itemData, onDelete, isDeletable, fields }) => {
  const [data, setData] = useState(itemData || {});

  const handleFieldChange = (value, fieldName) => {
    const updatedData = { ...data, [fieldName]: value };
    setData(updatedData);
    onChange(index, updatedData);
  };

  return (
    <div className="item my-4 p-4 border-b relative">
      <div className="absolute top-0 left-0 flex flex-col items-center space-y-2">
        <div className="cursor-grab w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full">
          <span className="text-gray-500">=</span>
        </div>
        {isDeletable && (
          <button
            onClick={() => onDelete(index)}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            X
          </button>
        )}
      </div>

      {fields.map((field) => (
        <input
          key={field.name}
          type={field.type || 'text'}
          className="w-full text-lg font-bold mt-2"
          value={data[field.name] || ''}
          onChange={(e) => handleFieldChange(e.target.value, field.name)}
          placeholder={field.placeholder}
        />
      ))}
    </div>
  );
};

export default Item;