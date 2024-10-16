import React from 'react';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import LinkItems from './LinkItems';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const CustomSectionItem = ({ section, onChange, isEditing }) => {
  const handleChange = (field, value) => {
    onChange({ ...section, [field]: value });
  };

  if (section.type === 'link') {
    return (
      <div>
        <LinkItems
          links={section.links || []}
          onChange={(newData) => onChange({ ...section, ...newData })}
          isEditing={isEditing}
        />
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <FloatingLabelTextarea
          label="내용"
          value={section.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder={PLACEHOLDERS[section.type] || PLACEHOLDERS.default}
          spellCheck="false"
        />
      ) : (
        <div>{section.content}</div>
      )}
    </div>
  );
};

export default CustomSectionItem;
