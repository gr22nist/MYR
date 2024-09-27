import React from 'react';
import CustomSectionInput from './CustomSectionInput';

const CustomSectionItem = ({ section, onSectionChange, onDelete }) => {
  const isCustomType = section.type === 'custom';

  return (
    <CustomSectionInput
      type={section.type}
      section={section}
      onSectionChange={onSectionChange}
      onDelete={onDelete}
      isDeletable={true}
      dragHandleProps={{}}
      className=""
      isCustomType={isCustomType}
    />
  );
};

export default CustomSectionItem;
