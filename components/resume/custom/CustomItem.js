import React from 'react';
import FloatingLabelTextarea from '@/components/common/FloatingLabelTextarea';
import LinkItems from './LinkItems';
import { PLACEHOLDERS } from '@/constants/placeHolders';

const CustomSectionItem = ({ section, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...section, [field]: value });
  };

  if (section.type === 'link') {
    return (
      <div className="bg-white rounded px-8 py-4">
        <LinkItems
          links={section.links || []}
          onChange={(newLinks) => handleChange('links', newLinks)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded px-8 py-4">
      <FloatingLabelTextarea
        label="내용"
        value={section.content || ''}
        onChange={(e) => handleChange('content', e.target.value)}
        placeholder={PLACEHOLDERS[section.type] || PLACEHOLDERS.default}
        spellCheck="false"
      />
    </div>
  );
};

export default CustomSectionItem;
