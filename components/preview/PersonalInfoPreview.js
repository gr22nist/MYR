import React from 'react';

const PersonalInfoPreview = ({ formData, fieldConfigs }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.keys(fieldConfigs).map((field) => {
        const value = formData[field];
        if (!value) return null; // 빈 필드 제외

        return (
          <div key={field} className="flex justify-between border-b p-2">
            <span className="font-semibold">{fieldConfigs[field].label}:</span>
            <span>{value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoPreview;
