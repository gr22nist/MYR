import React, { useState } from 'react';
import EducationItem from './EducationItem';
import DraggableList from '../../common/DraggableList';

const EducationList = () => {
  const [educations, setEducations] = useState([
    { id: '1', schoolName: '', major: '', period: '', graduationStatus: '재학중' }
  ]);

  const handleEducationChange = (id, updatedFields) => {
    const updatedEducations = educations.map(education =>
      education.id === id ? { ...education, ...updatedFields } : education
    );
    setEducations(updatedEducations);
  };

  const addEducation = () => {
    const newId = Date.now().toString();
    setEducations([...educations, { id: newId, schoolName: '', major: '', period: '', graduationStatus: '재학중' }]);
  };

  const deleteEducation = (id) => {
    const updatedEducations = educations.filter(education => education.id !== id);
    setEducations(updatedEducations);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedEducations = Array.from(educations);
    const [movedEducation] = reorderedEducations.splice(result.source.index, 1);
    reorderedEducations.splice(result.destination.index, 0, movedEducation);

    setEducations(reorderedEducations);
  };

  return (
    <div className="education-list">
      <h2 className="text-xl font-bold mb-4">학력</h2>

      <DraggableList
        items={educations}
        onDragEnd={onDragEnd}
        renderItem={(education) => (
          <EducationItem
            key={education.id}
            education={education}
            onEducationChange={handleEducationChange}
            onDelete={deleteEducation}
            isDeletable={educations.length > 1}
          />
        )}
      />

      {/* 학력 추가 버튼 */}
      <div className="mt-4 flex justify-center">
        <button
          className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"
          onClick={addEducation}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default EducationList;
