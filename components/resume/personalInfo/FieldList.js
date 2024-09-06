import React from 'react';
import InputField from './InputField';

const FieldList = ({ fields, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {fields.map((field) => (
        <InputField key={field.id} label={field.label} onRemove={() => onRemove(field.id)}>
          {field.component}
        </InputField>
      ))}
    </div>
  );
};

export default FieldList;
